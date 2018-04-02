import config from './src/config';
import { connect } from './src/backend/db';
import EntryRepository from './src/backend/repositories/entry-repository';

const seed = async db => {
  await EntryRepository(db).store({
    label: 'Check /',
    sourceType: 'Screenshot',
    sourceParams: { url: `http://localhost:${config.web.port}/` },
    sinkType: 'Slack',
    sinkParams: {
      text: `Watchlist changed! Check ${config.app.baseURL}/entries/{{ entry._id }}`,
      iconEmoji: ':male-detective:',
    },
    frequency: 'EVERY_15_MINUTES',
  });
};

connect(config.mongo).then(async client => {
  const db = client.db('watchlist');
  try {
    await seed(db);
  } finally {
    client.close();
  }
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
