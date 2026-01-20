import { Redis } from "@upstash/redis";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

/**
 * Production-safe endpoint to reset YOUR OWN rate limits
 * Only works for the authenticated user
 * 
 * Usage:
 * - GET /api/reset-my-limits → Reset your own limits
 */
export async function GET(req: NextRequest) {
    if (!redis) {
        return Response.json(
            { error: "Redis is not configured" },
            { status: 500 }
        );
    }

    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json(
                { error: "You must be authenticated to reset your limits" },
                { status: 401 }
            );
        }

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const deletedKeys: string[] = [];

        // Reset chat messages
        const chatUserKey = `messages:user:${userId}:${today}`;
        await redis.del(chatUserKey);
        deletedKeys.push(chatUserKey);

        // Reset job analyses
        const jobUserKey = `job-analysis:user:${userId}:${today}`;
        await redis.del(jobUserKey);
        deletedKeys.push(jobUserKey);

        // Get user plan to show correct limits
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const plan = (user.publicMetadata?.subscriptionPlan as string) || 'free';

        const limits = {
            chatMessages: plan === 'recruiter' ? 10 : 5,
            jobAnalyses: plan === 'recruiter' ? 5 : 3,
        };

        return Response.json({
            success: true,
            message: "Your rate limits have been reset successfully",
            userId,
            plan,
            limits,
            deletedKeys,
            resetAt: new Date().toISOString(),
            nextReset: getNextResetTime(),
        });
    } catch (error) {
        console.error("Error resetting limits:", error);
        return Response.json(
            { error: "Failed to reset limits", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

function getNextResetTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}

/**
 * Also support POST for scripts
 */
export async function POST(req: NextRequest) {
    return GET(req);
}
