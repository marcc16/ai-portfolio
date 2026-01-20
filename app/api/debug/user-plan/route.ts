import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check current user plan and metadata
 * Visit: /api/debug/user-plan
 */
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({
                error: 'Not authenticated',
                message: 'You must be logged in to view this information'
            }, { status: 401 });
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // Get organization memberships
        const orgMemberships = user.organizationMemberships || [];
        const orgPlans = orgMemberships.map((membership: any) => ({
            orgId: membership.organization?.id,
            orgName: membership.organization?.name,
            orgPlan: membership.organization?.publicMetadata?.plan,
        }));

        // Determine current plan using the same logic as the app
        let detectedPlan = 'free';

        // Check org memberships
        const hasRecruiterPlan = orgMemberships.some(
            (membership: any) => membership.organization?.publicMetadata?.plan === "recruiter"
        );
        if (hasRecruiterPlan) detectedPlan = 'recruiter';

        // Check public metadata
        const publicPlan = user.publicMetadata?.subscriptionPlan as string | undefined;
        if (publicPlan === "recruiter") detectedPlan = 'recruiter';

        // Check private metadata
        const privatePlan = user.privateMetadata?.subscriptionPlan as string | undefined;
        if (privatePlan === "recruiter") detectedPlan = 'recruiter';

        return NextResponse.json({
            userId,
            detectedPlan,
            messageLimit: detectedPlan === 'recruiter' ? 10 : 5,
            analysisLimit: detectedPlan === 'recruiter' ? 5 : 3,
            metadata: {
                public: user.publicMetadata,
                private: user.privateMetadata,
            },
            organizations: orgPlans,
            email: user.emailAddresses[0]?.emailAddress,
            createdAt: user.createdAt,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('[debug/user-plan] Error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
