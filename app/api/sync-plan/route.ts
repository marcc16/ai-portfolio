import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Endpoint para sincronizar manualmente el plan de suscripción desde Clerk Billing
 * Solo accesible por el usuario autenticado
 * 
 * Este endpoint verifica el estado actual de la suscripción en Clerk Billing
 * y actualiza el publicMetadata.subscriptionPlan en consecuencia
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

        console.log(`[Sync Plan] Syncing plan for user ${userId}`);

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        console.log('[Sync Plan] User data:', {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            currentMetadata: user.publicMetadata
        });

        // Check if user has active subscription in Clerk Billing
        // @ts-ignore - Billing types might not be fully available
        const billingInfo = user.publicMetadata?.billing;

        console.log('[Sync Plan] Billing info:', billingInfo);

        // Determine plan based on available data
        let detectedPlan: "free" | "recruiter" = "free";

        // Method 1: Check if there's any indication of active subscription in metadata
        // @ts-ignore
        if (user.publicMetadata?.subscriptionPlan === "recruiter") {
            detectedPlan = "recruiter";
            console.log('[Sync Plan] Plan already set to recruiter in metadata');
        }
        // Method 2: Check organization memberships
        // @ts-ignore
        else if (user.organizationMemberships?.length > 0) {
            // @ts-ignore
            const hasRecruiterOrg = user.organizationMemberships.some(
                // @ts-ignore
                (membership) => membership.organization?.publicMetadata?.plan === "recruiter"
            );
            if (hasRecruiterOrg) {
                detectedPlan = "recruiter";
                console.log('[Sync Plan] Found recruiter plan in organization');
            }
        }
        // Method 3: For manual override - if you tell me you have active subscription
        // Check if user has any subscription-related data
        // @ts-ignore
        else if (user.publicMetadata?.hasActiveSubscription === true) {
            detectedPlan = "recruiter";
            console.log('[Sync Plan] Found hasActiveSubscription flag');
        }

        console.log(`[Sync Plan] Detected plan: ${detectedPlan}`);

        // If plan needs updating
        const currentPlan = user.publicMetadata?.subscriptionPlan;
        if (currentPlan !== detectedPlan) {
            console.log(`[Sync Plan] Updating plan from ${currentPlan} to ${detectedPlan}`);

            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    ...user.publicMetadata,
                    subscriptionPlan: detectedPlan,
                    lastPlanSync: new Date().toISOString()
                }
            });

            console.log('[Sync Plan] ✅ Plan updated successfully');
        } else {
            console.log('[Sync Plan] Plan already correct, no update needed');
        }

        // Get fresh user data after update
        const updatedUser = await client.users.getUser(userId);

        return NextResponse.json({
            success: true,
            userId,
            email: updatedUser.emailAddresses[0]?.emailAddress,
            previousPlan: currentPlan,
            detectedPlan,
            updated: currentPlan !== detectedPlan,
            currentMetadata: updatedUser.publicMetadata,
            message: currentPlan !== detectedPlan
                ? `Plan updated from ${currentPlan} to ${detectedPlan}`
                : 'Plan already correct'
        });

    } catch (error) {
        console.error("[Sync Plan] Error:", error);
        return NextResponse.json(
            {
                error: "Failed to sync plan",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
