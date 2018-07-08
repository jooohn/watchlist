export default {
  web: {
    port: process.env.EXPRESS_PORT || '8080',
  },
  mongo: {
    host: process.env.MONGO_HOST || 'mongo',
    port: process.env.MONGO_PORT || '27017',
    db: process.env.MONGO_DB || 'watchlist',
  },
  app: {
    baseURL: process.env.BASE_URL,
    snapshots: {
      retention: {
        max: process.env.SNAPSHOT_RETENTION_MAX || 10,
      },
    },
  },
  sink: {
    slack: {
      webhook: process.env.SLACK_WEBHOOK_URL,
    },
  },
};
