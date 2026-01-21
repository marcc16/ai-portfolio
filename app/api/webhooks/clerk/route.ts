import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

// Configuración para Next.js: permitir leer el body raw
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('[Webhook] Missing svix headers');
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body as raw text (required by Svix)
    // Using clone to avoid consuming the original request
    let body: string;
    try {
        const payload = await req.json();
        body = JSON.stringify(payload);
        console.log('[Webhook] Body parsed from JSON');
    } catch (error) {
        console.error('[Webhook] Error parsing body as JSON:', error);
        return new Response('Invalid JSON body', {
            status: 400
        })
    }

    console.log('[Webhook] Body length:', body.length);
    console.log('[Webhook] Body preview:', body.substring(0, 200));

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent

        console.log('[Webhook] Verification successful');
    } catch (err) {
        console.error('[Webhook] Error verifying webhook:', err);
        return new Response('Error verifying webhook signature', {
            status: 400
        })
    }

    // Verificar que evt no sea null
    if (!evt || !evt.type) {
        console.error('[Webhook] evt is null or missing type after verification');
        console.error('[Webhook] evt value:', evt);
        return new Response('Invalid webhook payload', {
            status: 400
        })
    }

    // Handle the webhook
    const eventType = evt.type;

    console.log('=== CLERK WEBHOOK RECEIVED ===');
    console.log('Event Type:', eventType);
    console.log('Event Data:', JSON.stringify(evt.data, null, 2));

    // Handle user.created
    if (eventType === 'user.created') {
        // Welcome email or initial setup
        console.log(`User created: ${evt.data.id}`);
    }

    // Handle user.updated - Sometimes Clerk updates metadata directly
    if (eventType === 'user.updated') {
        console.log('=== PROCESSING USER.UPDATED EVENT ===');

        // @ts-ignore
        const userData = evt.data;
        // @ts-ignore
        const userId = userData.id;
        // @ts-ignore
        const publicMetadata = userData.public_metadata || {};

        console.log('User ID:', userId);
        console.log('Public Metadata:', JSON.stringify(publicMetadata, null, 2));

        // Check if this update includes subscription information
        // @ts-ignore
        if (publicMetadata.subscriptionPlan) {
            // @ts-ignore
            const plan = publicMetadata.subscriptionPlan;
            console.log(`✅ Detected plan in metadata: ${plan}`);
            // Plan already updated by Clerk, nothing to do
        }
    }

    // Handle Billing Events
    // We need to handle multiple billing events to ensure plan updates
    const billingEvents = [
        'subscription.created',
        'subscription.updated',
        'subscriptionItem.active',
        'subscriptionItem.created',
        'subscriptionItem.updated'
    ];

    if (billingEvents.includes(eventType)) {
        console.log('=== PROCESSING BILLING EVENT ===');
        console.log('Event type:', eventType);
        console.log('Full event data:', JSON.stringify(evt.data, null, 2));

        // @ts-ignore - Billing events might not be fully typed in current SDK version
        const eventData = evt.data;

        // Try multiple ways to extract userId
        // @ts-ignore
        let userId = eventData.user_id ||
            eventData.payer?.user_id ||  // For subscriptionItem events
            eventData.subscription?.user_id ||
            eventData.object?.subscription?.customer_id;

        console.log('Extracted user ID:', userId);

        // Also log payer info if available
        // @ts-ignore
        if (eventData.payer) {
            console.log('Payer info:', JSON.stringify(eventData.payer, null, 2));
        }

        if (!userId) {
            console.error('❌ Failed to extract userId from event');
            console.error('Event keys available:', Object.keys(eventData));
            if (eventData.subscription) {
                console.error('Subscription keys:', Object.keys(eventData.subscription));
            }
            // @ts-ignore
            if (eventData.payer) {
                // @ts-ignore
                console.error('Payer keys:', Object.keys(eventData.payer));
            }
            return new Response('', { status: 200 });
        }

        // Determine the plan based on the event
        let planName = 'free';

        // For subscriptionItem events
        if (eventType.startsWith('subscriptionItem')) {
            // @ts-ignore
            const status = eventData.status;
            console.log('SubscriptionItem status:', status);

            if (status === 'active') {
                planName = 'recruiter';
                console.log('Setting plan to recruiter (subscriptionItem.active)');
            } else if (status === 'canceled' || status === 'ended') {
                planName = 'free';
                console.log('Setting plan to free (subscription canceled/ended)');
            }
        }
        // For subscription events
        else if (eventType.startsWith('subscription')) {
            // @ts-ignore
            const status = eventData.status;
            // @ts-ignore
            const items = eventData.items || [];
            // @ts-ignore
            const activeItem = items.find(item => item.status === 'active');

            console.log('Subscription status:', status);
            console.log('Active items:', items.length);
            console.log('Has active item:', !!activeItem);

            if (status === 'active' && activeItem) {
                planName = 'recruiter';
                console.log('Setting plan to recruiter (subscription.active with active items)');
            } else {
                planName = 'free';
                console.log('Setting plan to free (no active subscription)');
            }
        }

        console.log(`Updating user ${userId} metadata to plan: ${planName}`);

        try {
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    subscriptionPlan: planName
                }
            });

            console.log(`✅ Successfully updated user ${userId} plan to ${planName}`);

            // Verify the update
            const updatedUser = await client.users.getUser(userId);
            console.log('Verified publicMetadata:', updatedUser.publicMetadata);
        } catch (error) {
            console.error('❌ Error updating user metadata:', error);
        }
    }

    // Handle subscription cancellation events
    if (eventType === 'subscriptionItem.canceled' || eventType === 'subscriptionItem.ended') {
        console.log('=== PROCESSING CANCELLATION EVENT ===');

        // @ts-ignore
        const eventData = evt.data;
        // @ts-ignore
        const userId = eventData.user_id || eventData.subscription?.user_id;

        if (userId) {
            console.log(`Downgrading user ${userId} to free plan`);

            try {
                const client = await clerkClient();
                await client.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        subscriptionPlan: 'free'
                    }
                });
                console.log(`✅ Successfully downgraded user ${userId} to free plan`);
            } catch (error) {
                console.error('❌ Error downgrading user:', error);
            }
        }
    }

    console.log('=== WEBHOOK PROCESSING COMPLETE ===\n');
    return new Response('', { status: 200 })
}
