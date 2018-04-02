import { connect } from '../db';
import entryRepository from './entry-repository';
import snapshotRepository from './snapshot-repository';

export default async ({ host, port, db }) => {
  const client = await connect({ host, port });
  const watchlist = client.db(db);
  return {
    client,
    entryRepository: entryRepository(watchlist),
    snapshotRepository: snapshotRepository(watchlist),
  };
};
