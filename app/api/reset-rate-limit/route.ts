import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * TEMPORARY DEBUG ENDPOINT
 * Reset rate limit for current IP
 * DELETE THIS FILE AFTER DEBUGGING
 */
export async function POST(req: NextRequest) {
    try {
        const redis = Redis.fromEnv();

        // Get IP
        const forwardedFor = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const ipAddress = forwardedFor || realIp || "unknown";

        if (ipAddress === "unknown") {
            return NextResponse.json(
                { error: "Could not determine IP address" },
                { status: 400 }
            );
        }

        // Delete the rate limit key for this IP
        const key = `ip:${ipAddress}`;
        await redis.del(key);

        return NextResponse.json({
            success: true,
            message: `Rate limit reset for IP: ${ipAddress}`,
            key,
        });
    } catch (error) {
        console.error("[reset-rate-limit] Error:", error);
        return NextResponse.json(
            { error: "Failed to reset rate limit" },
            { status: 500 }
        );
    }
}
