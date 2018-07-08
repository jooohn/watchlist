import { backendSourceOfType } from '../sources/backend';
import { backendSinkOfType } from '../sinks/backend';

const extractContent = ({ data = null, error = null }) => ({ data, error });

const isChanged = source => async (before, after) => {
  const contentBefore = extractContent(before);
  const contentAfter = extractContent(after);
  if (contentBefore.error !== contentAfter.error) {
    return true;
  }
  if (!!contentBefore.data !== !!contentAfter.data) {
    return true;
  }
  if (contentBefore.data && contentAfter.data) {
    return await source.isChanged({
      before: contentBefore.data,
      after: contentAfter.data
    });
  }
  return false;
};

export default ({
  repositories: { snapshotRepository },
  app,
}) => async entry => {
  console.log(`checking entry: ${entry._id}`);
  const source = backendSourceOfType(entry.sourceType).withParams(entry.sourceParams);
  const sink = backendSinkOfType(entry.sinkType);

  const snapshots = await snapshotRepository.resolveAllForEntry(entry._id);
  const lastSnapshot = snapshots[0];
  const lastContent = extractContent(lastSnapshot || {});

  const newContent = await source.fetch().then(
    data => ({ data }),
    e => ({ error: e.message })
  );

  if (await isChanged(source)(lastContent, newContent)) {
    console.log(`diff detected: ${entry._id}`);
    const diff = (newContent.data)
      ? await source.diffOf({ before: lastContent.data, after: newContent.data })
      : null;
    const newSnapshot = await snapshotRepository.store(entry, {
      ...newContent,
      diff,
    });
    try {
      await sink.run({
        entry: entry,
        before: lastSnapshot,
        after: newSnapshot,
        params: entry.sinkParams,
      });
      snapshots.unshift(
        await snapshotRepository.storeOutcome(newSnapshot, { succeeded: true }),
      );
    } catch (e) {
      console.error(`[snapshot:${newSnapshot._id}] sink failed: ${e.message}`);
      snapshots.unshift(
        await snapshotRepository.storeOutcome(newSnapshot, {
          succeeded: false,
          message: e.message,
        }),
      );
    } finally {
      const staleIds = snapshots
        .slice(app.snapshots.retention.max)
        .map(({ _id }) => _id);
      await snapshotRepository.removeByIds(staleIds);
    }
    return { changed: true };
  } else {
    console.log(`nothing changed: ${entry._id}`);
    return { changed: false };
  }
};
