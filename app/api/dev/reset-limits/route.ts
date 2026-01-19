import { Redis } from "@upstash/redis";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// ONLY allow in development
const isDevelopment = process.env.NODE_ENV === "development";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

/**
 * Development-only endpoint to reset rate limits
 *
 * Usage:
 * - GET /api/dev/reset-limits                     → Reset current user/IP
 * - GET /api/dev/reset-limits?ip=YOUR_IP          → Reset specific guest IP
 * - GET /api/dev/reset-limits?userId=user_xxx     → Reset specific Clerk user
 * - GET /api/dev/reset-limits?all=true            → Reset ALL limits (guests + users)
 * - GET /api/dev/reset-limits?pattern=messages:*  → Reset by Redis pattern
 */
export async function GET(req: NextRequest) {
    // Security check - only allow in development
    if (!isDevelopment) {
        return Response.json(
            { error: "This endpoint is only available in development mode" },
            { status: 403 }
        );
    }

    if (!redis) {
        return Response.json(
            { error: "Redis is not configured" },
            { status: 500 }
        );
    }

    try {
        const { userId: currentUserId } = await auth();
        const searchParams = req.nextUrl.searchParams;

        const targetIp = searchParams.get("ip");
        const targetUserId = searchParams.get("userId");
        const resetAll = searchParams.get("all") === "true";
        const pattern = searchParams.get("pattern");

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const deletedKeys: string[] = [];
        let resetInfo: any = { date: today };

        // Option 1: Reset ALL limits using pattern
        if (resetAll || pattern) {
            const searchPattern = pattern || "messages:*,job-analysis:*";
            const patterns = searchPattern.split(",");

            for (const pat of patterns) {
                const keys = await redis.keys(pat.trim());
                if (keys && keys.length > 0) {
                    // Delete all matching keys
                    for (const key of keys) {
                        await redis.del(key);
                        deletedKeys.push(key as string);
                    }
                }
            }

            resetInfo = {
                ...resetInfo,
                mode: resetAll ? "all" : "pattern",
                pattern: patterns,
                keysDeleted: deletedKeys.length,
            };
        }
        // Option 2: Reset specific Clerk user by userId
        else if (targetUserId) {
            const chatUserKey = `messages:user:${targetUserId}:${today}`;
            await redis.del(chatUserKey);
            deletedKeys.push(chatUserKey);

            const jobUserKey = `job-analysis:user:${targetUserId}:${today}`;
            await redis.del(jobUserKey);
            deletedKeys.push(jobUserKey);

            resetInfo = {
                ...resetInfo,
                mode: "user",
                userId: targetUserId,
            };
        }
        // Option 3: Reset specific guest IP
        else if (targetIp) {
            const chatGuestKey = `messages:guest:${targetIp}:${today}`;
            await redis.del(chatGuestKey);
            deletedKeys.push(chatGuestKey);

            const jobGuestKey = `job-analysis:guest:${targetIp}:${today}`;
            await redis.del(jobGuestKey);
            deletedKeys.push(jobGuestKey);

            resetInfo = {
                ...resetInfo,
                mode: "guest-ip",
                ip: targetIp,
            };
        }
        // Option 4: Reset current user/IP (default)
        else {
            const requestIp = req.headers.get("x-forwarded-for") || "127.0.0.1";

            // Reset guest IP
            const chatGuestKey = `messages:guest:${requestIp}:${today}`;
            await redis.del(chatGuestKey);
            deletedKeys.push(chatGuestKey);

            const jobGuestKey = `job-analysis:guest:${requestIp}:${today}`;
            await redis.del(jobGuestKey);
            deletedKeys.push(jobGuestKey);

            // If user is authenticated, also reset their user limits
            if (currentUserId) {
                const chatUserKey = `messages:user:${currentUserId}:${today}`;
                await redis.del(chatUserKey);
                deletedKeys.push(chatUserKey);

                const jobUserKey = `job-analysis:user:${currentUserId}:${today}`;
                await redis.del(jobUserKey);
                deletedKeys.push(jobUserKey);
            }

            resetInfo = {
                ...resetInfo,
                mode: "current",
                ip: requestIp,
                userId: currentUserId || "not authenticated",
            };
        }

        return Response.json({
            success: true,
            message: "Rate limits reset successfully",
            resetInfo,
            deletedKeys,
            deletedCount: deletedKeys.length,
            info: {
                chatMessages: "Reset to max (3 for guest, 5 for free user, 10 for recruiter)",
                jobAnalyses: "Reset to max (1 for guest, 3 for free user, 5 for recruiter)",
            },
            examples: {
                resetCurrentUser: "/api/dev/reset-limits",
                resetSpecificUser: "/api/dev/reset-limits?userId=user_2xxx",
                resetSpecificIP: "/api/dev/reset-limits?ip=192.168.1.1",
                resetAll: "/api/dev/reset-limits?all=true",
                resetPattern: "/api/dev/reset-limits?pattern=messages:user:*",
            }
        });
    } catch (error) {
        console.error("Error resetting limits:", error);
        return Response.json(
            { error: "Failed to reset limits", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

/**
 * Also support POST for scripts
 */
export async function POST(req: NextRequest) {
    return GET(req);
}
