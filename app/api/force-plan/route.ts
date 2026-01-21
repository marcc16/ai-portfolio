import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Endpoint temporal para FORZAR el plan a recruiter manualmente
 * Solo para debugging - el usuario debe estar autenticado
 * 
 * USO: POST con body { "plan": "recruiter" } o { "plan": "free" }
 */
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const forcedPlan = body.plan || "recruiter";

        if (forcedPlan !== "free" && forcedPlan !== "recruiter") {
            return NextResponse.json(
                { error: "Invalid plan. Must be 'free' or 'recruiter'" },
                { status: 400 }
            );
        }

        console.log(`[Force Plan] Forcing plan to ${forcedPlan} for user ${userId}`);

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        console.log('[Force Plan] Current metadata:', user.publicMetadata);

        // Force update the plan
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                ...user.publicMetadata,
                subscriptionPlan: forcedPlan,
                manuallyForced: true,
                forcedAt: new Date().toISOString()
            }
        });

        console.log(`[Force Plan] ✅ Successfully forced plan to ${forcedPlan}`);

        // Verify the update
        const updatedUser = await client.users.getUser(userId);

        return NextResponse.json({
            success: true,
            userId,
            email: updatedUser.emailAddresses[0]?.emailAddress,
            forcedPlan,
            metadata: updatedUser.publicMetadata,
            message: `Plan successfully forced to ${forcedPlan}. This is a manual override.`
        });

    } catch (error) {
        console.error("[Force Plan] Error:", error);
        return NextResponse.json(
            {
                error: "Failed to force plan",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// GET endpoint to check current plan
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        return NextResponse.json({
            userId,
            email: user.emailAddresses[0]?.emailAddress,
            currentPlan: user.publicMetadata?.subscriptionPlan || "free",
            metadata: user.publicMetadata
        });

    } catch (error) {
        console.error("[Force Plan GET] Error:", error);
        return NextResponse.json(
            { error: "Failed to get plan" },
            { status: 500 }
        );
    }
}
