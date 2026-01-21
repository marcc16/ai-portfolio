import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * ENDPOINT TEMPORAL PARA DEBUG
 * Solo para actualizar el plan del usuario AUTENTICADO
 * TODO: ELIMINAR después de verificar que los webhooks funcionen
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
        const plan = body.plan || "recruiter";

        if (plan !== "free" && plan !== "recruiter") {
            return NextResponse.json(
                { error: "Invalid plan" },
                { status: 400 }
            );
        }

        console.log(`[DEBUG Update Plan] Updating plan to ${plan} for user ${userId}`);

        const client = await clerkClient();

        // Actualizar SOLO el metadata del usuario autenticado
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                subscriptionPlan: plan,
                debugUpdatedAt: new Date().toISOString(),
            }
        });

        console.log(`[DEBUG Update Plan] ✅ Successfully updated`);

        const updatedUser = await client.users.getUser(userId);

        return NextResponse.json({
            success: true,
            plan,
            metadata: updatedUser.publicMetadata,
            message: `Plan updated to ${plan}. Reload the page to test.`
        });

    } catch (error) {
        console.error("[DEBUG Update Plan] Error:", error);
        return NextResponse.json(
            { error: "Failed to update plan" },
            { status: 500 }
        );
    }
}
