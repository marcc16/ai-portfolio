"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { hasRemainingJobAnalyses } from "@/lib/message-tracking";

/**
 * Get user's subscription plan from Clerk
 */
async function getUserPlan(userId: string): Promise<"free" | "recruiter"> {
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // Check if user has active subscription to "recruiter" plan
        // @ts-ignore
        const subscriptions = user.organizationMemberships || [];
        const hasRecruiterPlan = subscriptions.some(
            (membership: any) => membership.organization?.publicMetadata?.plan === "recruiter"
        );

        if (hasRecruiterPlan) return "recruiter";

        // Also check public metadata for manual assignments
        const plan = user.publicMetadata?.subscriptionPlan as string | undefined;
        if (plan === "recruiter") return "recruiter";

        // Check private metadata (set by Clerk Billing webhooks)
        const privateMetadataPlan = user.privateMetadata?.subscriptionPlan as string | undefined;
        if (privateMetadataPlan === "recruiter") return "recruiter";

        return "free";
    } catch (error) {
        console.error("Error fetching user plan:", error);
        return "free";
    }
}

/**
 * Get analysis limit based on user status and plan
 */
function getAnalysisLimit(isGuest: boolean, plan: "free" | "recruiter"): number {
    if (isGuest) return 1;
    if (plan === "recruiter") return 5;
    return 3; // free authenticated users
}

/**
 * Get current job analysis usage for the user/guest
 */
export async function getJobAnalysisUsage() {
    const { userId } = await auth();
    const isGuest = !userId;

    // Get user's plan if authenticated
    const plan = userId ? await getUserPlan(userId) : "free";
    const analysisLimit = getAnalysisLimit(isGuest, plan);

    let identifier: string;
    if (userId) {
        identifier = userId;
    } else {
        const { headers } = await import("next/headers");
        const forwardedFor = (await headers()).get("x-forwarded-for");
        const isDev = process.env.NODE_ENV === "development";
        identifier = forwardedFor ?? (isDev ? "86.106.2.121" : "127.0.0.1");
    }

    const usage = await hasRemainingJobAnalyses(identifier, isGuest, analysisLimit);

    return {
        ...usage,
        plan, // Include plan info in response
    };
}
