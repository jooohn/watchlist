import { backendSourceOfType } from '../sources/backend';
import { backendSinkOfType } from '../sinks/backend';

const extractContent = ({ data = null, error = null }) => ({ data, error });
const isChanged = (before, after) =>
  JSON.stringify(extractContent(before)) !==
  JSON.stringify(extractContent(after));

export default ({
  repositories: { snapshotRepository },
  app,
}) => async entry => {
  console.log(`checking entry: ${entry._id}`);
  const source = backendSourceOfType(entry.sourceType);
  const sink = backendSinkOfType(entry.sinkType);

  const snapshots = await snapshotRepository.resolveAllForEntry(entry._id);
  const lastSnapshot = snapshots[0];
  const lastContent = extractContent(lastSnapshot || {});

  const newContent = await source
    .fetch(entry.sourceParams)
    .then(data => ({ data }), e => ({ error: e.message }));

  if (isChanged(lastContent, newContent)) {
    console.log(`diff detected: ${entry._id}`);
    const diff = await source.compare({
      before: lastContent,
      after: newContent,
    });
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
