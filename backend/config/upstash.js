import { Redis } from '@upstash/redis';
const redis = new Redis({
  redis: Redis.fromEnv(),
  limiter: RateLimit(),
});

await redis.set('foo', 'bar');
await redis.get('foo');
