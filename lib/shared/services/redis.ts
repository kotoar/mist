import Redis from 'ioredis';

const redis = new Redis(
  parseInt(process.env.REDIS_PORT || '6379'),
  process.env.REDIS_HOST || 'localhost',
  {
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    db: 0,
    connectTimeout: 10000, // 10 seconds
    enableReadyCheck: false,
    lazyConnect: true,
    maxRetriesPerRequest: 3
  }
);

export { redis };