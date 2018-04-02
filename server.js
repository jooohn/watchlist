import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import config from './src/config';
import api from './src/backend/routes/api';
import buildRepositories from './src/backend/repositories';
import scheduler from './src/backend/scheduler';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const run = async () => {
  const repositories = await buildRepositories(config.mongo);
  const injection = { repositories, app: config.app };
  const cleanup = scheduler(injection);
  await app.prepare();
  const server = express()
    .use(bodyParser.json())
    .use('/api', api(injection))
    .get('/entries/:id', (req, res) => {
      const actualPage = '/entries/show';
      const queryParams = { id: req.params.id };
      app.render(req, res, actualPage, queryParams);
    })
    .get('*', (req, res) => handle(req, res))
    .listen(config.web.port, err => {
      if (err) throw err;
      console.log(`> Ready on port ${config.web.port}`);
    });


  const shutdown = () => {
    cleanup();
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
};
run().catch(e => {
  console.error(e);
  process.exit(1);
});
