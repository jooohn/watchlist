import config from '../config';
const {
  mongo: { host, port },
} = config;
import { connect } from '../backend/db';
import buildRepositories from '../backend/repositories';

const testDBName = 'test';

export const resetTestDB = async () => {
  const conn = await connect({ host, port });
  const db = conn.db(testDBName);
  await Promise.all([
    db.collection('entries').deleteMany({}),
    db.collection('snapshots').deleteMany({}),
  ]);
  const [{ insertedIds }] = await Promise.all([
    db.collection('entries').insertMany(
      [1, 2, 3].map(num => ({
        label: `entry${num}`,
        sourceType: 'Snapshot',
        sourceParams: { url: 'http://localhost:3000' },
        sinkType: 'Console',
        sinkParams: { format: 'TEST' },
        frequency: 'EVERY_15_MINUTES',
        createdAt: new Date(),
      })),
    ),
  ]);

  await Promise.all([
    db.collection('snapshots').insertMany(
      Object.keys(insertedIds).map(key => ({
        entryId: insertedIds[key],
        succeeded: true,
        data: 'DUMMY',
        error: null,
        diff: 'DUMMY',
        createdAt: new Date(),
      })),
    ),
  ]);
};

export const buildTestRepositories = async () =>
  buildRepositories({ host, port, db: testDBName });

export default { resetTestDB, buildTestRepositories };
