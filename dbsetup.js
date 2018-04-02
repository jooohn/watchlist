import config from './src/config';
import { connect } from './src/backend/db';
import EntryRepository from './src/backend/repositories/entry-repository';

const nullable = schema => ({
  oneOf: [
    schema,
    { type: 'null' },
  ]
});

const cleanup = async db => {
  const collections = await db.listCollections().toArray();
  await Promise.all(collections.map(async ({ name }) => {
    console.log(`dropping ${name}`);
    await db.collection(name).drop();
  }));
};

const setupEntries = async db => {
  console.log('creating "entries" table.');
  await db.createCollection('entries', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'label',
          'sourceType',
          'sourceParams',
          'sinkType',
          'sinkParams',
          'frequency'
        ],
        properties: {
          label: { bsonType: 'string' },
          sourceType: { bsonType: 'string' },
          sourceParams: { bsonType: 'object' },
          sinkType: { bsonType: 'string' },
          sinkParams: { bsonType: 'object' },
          frequency: { bsonType: 'string' },
          createdAt: { bsonType: 'date' },
        },
      }
    }
  });
};

const setupSnapshots = async db => {

  console.log('creating "snapshots" table.');
  await db.createCollection('snapshots', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'entryId',
          'succeeded',
          'createdAt',
        ],
        properties: {
          entryId: { bsonType: 'objectId' },
          succeeded: { bsonType: 'bool' },
          data: {},
          error: nullable({ type: 'string' }),
          createdAt: { bsonType: 'date' },
          outcome: {
            bsonType: 'object',
            required: ['succeeded'],
            properties: {
              succeeded: { bsonType: 'bool' },
              error: nullable({ type: 'string' }),
            }
          },
          finishedAt: { bsonType: 'date' },
        },
      },
    },
  });

  console.log('creating "snapshots" indices.');
  await db.collection('snapshots').createIndex({
    entryId: 1,
    createdAt: -1,
  });

};

connect(config.mongo).then(async client => {
  const db = client.db('watchlist');
  try {
    await cleanup(db);
    await setupEntries(db);
    await setupSnapshots(db);
  } finally {
    client.close();
  }
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
