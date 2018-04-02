import { ObjectID } from 'mongodb';
import { dbUtils } from '../db';

export default db => {
  const collection = db.collection('snapshots');
  const util = dbUtils(collection);

  const store = async (entry, { data, error, diff }) =>
    util.insertOneAndReturn({
      entryId: entry._id,
      succeeded: !error,
      data,
      error,
      diff,
      createdAt: new Date(),
    });

  const storeOutcome = async ({ _id }, { succeeded = null, message = null }) =>
    collection.updateOne(
      { _id: ObjectID(_id) },
      {
        $set: {
          outcome: { succeeded, message },
          finishedAt: new Date(),
        },
      },
    );

  const resolveLatestBy = async ({ entryIds }) => {
    const aggregationCursor = await collection.aggregate([
      { $sort: { _id: 1 } },
      { $match: { entryId: { $in: entryIds.map(ObjectID) } } },
      { $group: { _id: '$entryId', latest: { $last: '$$ROOT' } } },
    ]);
    const aggregation = await aggregationCursor.toArray();
    return aggregation.map(row => row.latest);
  };

  const resolveAllForEntry = async entryId =>
    collection
      .find({
        $query: { entryId: ObjectID(entryId) },
        $orderby: { createdAt: -1 },
      })
      .toArray();

  const removeByIds = async ids =>
    collection.removeMany({
      _id: {
        $in: ids.map(ObjectID),
      },
    });

  const removeByEntryId = async entryId =>
    collection.deleteMany({ entryId: ObjectID(entryId) });

  return {
    store,
    storeOutcome,
    resolveLatestBy,
    resolveAllForEntry,
    removeByIds,
    removeByEntryId,
  };
};
