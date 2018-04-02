import util from 'util';
import mongo from 'mongodb';

export const dbUtils = collection => {
  const insertOneAndReturn = async record =>
    collection
      .insertOne(record)
      .then(({ insertedId }) => ({ _id: insertedId, ...record }));

  return {
    insertOneAndReturn,
  };
};

export const connect = async ({ host, port }) => {
  const url = `mongodb://${host}:${port}`;
  return await util.promisify(mongo.MongoClient.connect)(url);
};

export default { dbUtils, connect };
