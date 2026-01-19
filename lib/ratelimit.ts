import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Safe initialization of Redis and Ratelimit
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Create a new ratelimiter that allows 10 requests per 10 seconds
export const ratelimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit",
    })
    : { limit: async () => ({ success: true }) }; // Mock fallback if no Redis

// More restrictive rate limit for expensive operations (like AI analysis)
export const aiRatelimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
        analytics: true,
        prefix: "@upstash/ratelimit/ai",
    })
    : { limit: async () => ({ success: true }) }; // Mock fallback
