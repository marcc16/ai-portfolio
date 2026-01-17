import { Redis } from "@upstash/redis";

// Safe initialization of Redis
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Daily message limits
export const MESSAGE_LIMITS = {
    GUEST: 3,
    AUTHENTICATED: 10,
} as const;

interface MessageCount {
    count: number;
    resetAt: string; // ISO string
}

/**
 * Get the key for tracking daily messages
 */
function getMessageKey(identifier: string, isGuest: boolean): string {
    const prefix = isGuest ? "guest" : "user";
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return `messages:${prefix}:${identifier}:${today}`;
}

/**
 * Get message count for a user/guest
 */
export async function getMessageCount(
    identifier: string,
    isGuest: boolean
): Promise<MessageCount> {
    if (!redis) {
        // No Redis configured - allow all messages
        return {
            count: 0,
            resetAt: getNextResetTime(),
        };
    }

    const key = getMessageKey(identifier, isGuest);
    const count = await redis.get<number>(key);

    return {
        count: count || 0,
        resetAt: getNextResetTime(),
    };
}

/**
 * Increment message count and return new count
 */
export async function incrementMessageCount(
    identifier: string,
    isGuest: boolean
): Promise<MessageCount> {
    if (!redis) {
        // No Redis configured - allow all messages
        return {
            count: 0,
            resetAt: getNextResetTime(),
        };
    }

    const key = getMessageKey(identifier, isGuest);
    const newCount = await redis.incr(key);

    // Set expiration to end of day (in seconds)
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const ttl = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);

    await redis.expire(key, ttl);

    return {
        count: newCount,
        resetAt: getNextResetTime(),
    };
}

/**
 * Check if user/guest has remaining messages
 */
export async function hasRemainingMessages(
    identifier: string,
    isGuest: boolean
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const { count } = await getMessageCount(identifier, isGuest);
    const limit = isGuest ? MESSAGE_LIMITS.GUEST : MESSAGE_LIMITS.AUTHENTICATED;
    const remaining = Math.max(0, limit - count);

    return {
        allowed: count < limit,
        remaining,
        limit,
    };
}

/**
 * Get the next reset time (midnight)
 */
function getNextResetTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}
