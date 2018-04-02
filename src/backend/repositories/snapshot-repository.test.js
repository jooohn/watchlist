import test from 'ava';
import { ObjectID } from 'mongodb';
import { resetTestDB, buildTestRepositories } from '../../helpers/SpecHelper';

test.before(async _ => await resetTestDB());

test('#resolveLatestBy', async t => {
  const { entryRepository, snapshotRepository } = await buildTestRepositories();
  const entries = await entryRepository.resolveAll();
  const entry = entries[0];

  const newSnapshot = await snapshotRepository.store(entry, {
    data: 'DUMMY',
    error: null,
    diff: 'DUMMY',
  });

  const aggregated = await snapshotRepository.resolveLatestBy({
    entryIds: entries.map(e => e._id),
  });
  const found = aggregated.find(a => a.entryId.equals(entry._id));

  t.true(newSnapshot._id.equals(found._id));
});
