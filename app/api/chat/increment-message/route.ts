import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { incrementMessageCount, hasRemainingMessages } from "@/lib/message-tracking";

/**
 * API endpoint to increment message count when a message is actually sent
 * This should be called from the client after a message is successfully sent
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const isGuest = !userId;

    // Get plan and message limit (same logic as create-session)
    const plan = userId ? await getUserPlan(userId) : "free";
    const messageLimit = getMessageLimit(isGuest, plan);

    // Get identifier
    let identifier: string;
    if (userId) {
      identifier = userId;
    } else {
      const { headers, cookies } = await import("next/headers");
      const forwardedFor = (await headers()).get("x-forwarded-for");
      const realIp = (await headers()).get("x-real-ip");

      const ipAddress = forwardedFor || realIp || "unknown";

      // Use consistent identifier logic with create-session.ts
      if (ipAddress === "unknown") {
        const cookieStore = await cookies();
        let guestId = cookieStore.get("guest_session_id")?.value;
        if (!guestId) {
          guestId = `guest_${Date.now()}`;
        }
        identifier = `ip_unknown:${guestId}`;
      } else {
        identifier = `ip:${ipAddress}`;
      }
    }

    // Check if user still has remaining messages
    const { allowed } = await hasRemainingMessages(identifier, isGuest, messageLimit);

    if (!allowed) {
      return NextResponse.json(
        { error: "Message limit reached", allowed: false },
        { status: 429 }
      );
    }

    // Increment the counter
    const result = await incrementMessageCount(identifier, isGuest, messageLimit);

    return NextResponse.json({
      success: true,
      count: result.count,
      resetAt: result.resetAt,
      allowed: true,
    });
  } catch (error) {
    console.error("[increment-message] Error:", error);
    return NextResponse.json(
      { error: "Failed to increment message count" },
      { status: 500 }
    );
  }
}

// Helper functions (duplicated from create-session.ts for now)
// TODO: Move to a shared utility file

async function getUserPlan(userId: string): Promise<"free" | "recruiter"> {
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    console.log('=== GETTING USER PLAN (increment-message) ===');
    console.log('User ID:', userId);
    console.log('User email:', user.emailAddresses[0]?.emailAddress);
    console.log('User public metadata:', JSON.stringify(user.publicMetadata, null, 2));
    console.log('User private metadata:', JSON.stringify(user.privateMetadata, null, 2));

    // Check organization memberships
    // @ts-ignore
    const subscriptions = user.organizationMemberships || [];
    console.log('Organization memberships count:', subscriptions.length);

    if (subscriptions.length > 0) {
      console.log('Organization memberships:', JSON.stringify(subscriptions, null, 2));
    }

    const hasRecruiterPlan = subscriptions.some(
      (membership: any) => membership.organization?.publicMetadata?.plan === "recruiter"
    );
    console.log('Has recruiter via org:', hasRecruiterPlan);

    if (hasRecruiterPlan) {
      console.log('✅ Returning recruiter (via organization)');
      return "recruiter";
    }

    // Check public metadata
    const plan = user.publicMetadata?.subscriptionPlan as string | undefined;
    console.log('subscriptionPlan in publicMetadata:', plan);

    if (plan === "recruiter") {
      console.log('✅ Returning recruiter (via publicMetadata)');
      return "recruiter";
    }

    // Check private metadata
    const privateMetadataPlan = user.privateMetadata?.subscriptionPlan as string | undefined;
    console.log('subscriptionPlan in privateMetadata:', privateMetadataPlan);

    if (privateMetadataPlan === "recruiter") {
      console.log('✅ Returning recruiter (via privateMetadata)');
      return "recruiter";
    }

    console.log('⚠️ Returning free (no recruiter plan found anywhere)');
    console.log('=== END GETTING USER PLAN ===');
    return "free";
  } catch (error) {
    console.error("❌ Error fetching user plan:", error);
    return "free";
  }
}

function getMessageLimit(isGuest: boolean, plan: "free" | "recruiter"): number {
  if (isGuest) return 3;
  if (plan === "recruiter") return 10;
  return 5;
}
