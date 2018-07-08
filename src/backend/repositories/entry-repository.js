import { ObjectID } from 'mongodb';
import { dbUtils } from '../db';

export default db => {
  const collection = db.collection('entries');
  const util = dbUtils(collection);

  const resolve = async id => collection.findOne({ _id: ObjectID(id) });

  const resolveAll = async () =>
    collection
      .find()
      .sort({ _id: -1 })
      .toArray();

  const store = async ({
    label,
    sourceType,
    sourceParams,
    sinkType,
    sinkParams,
    frequency,
  }) =>
    util.insertOneAndReturn({
      label,
      sourceType,
      sourceParams,
      sinkType,
      sinkParams,
      frequency,
      createdAt: new Date(),
    });

  const update = id => async ({
    label,
    // SourceType is not allowed to update.
    // sourceType,
    sourceParams,
    sinkType,
    sinkParams,
    frequency,
  }) => {
    const params = {
      label,
      sourceParams,
      sinkType,
      sinkParams,
      frequency,
    };
    await collection.updateOne({ _id: ObjectID(id) }, { $set: params });
    return await resolve(id);
  };

  const remove = async id => collection.deleteOne({ _id: ObjectID(id) });

  return { resolveAll, store, update, resolve, remove };
};
