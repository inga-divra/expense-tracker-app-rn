import { Redis } from '@upstash/redis';
import { RateLimit } from '@upstash/ratelimit';
const redis = new Redis({
  redis: Redis.fromEnv(),
  limiter: RateLimit(),
});
