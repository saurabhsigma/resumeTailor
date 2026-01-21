import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectToDatabase from "@/lib/db";
import { Subscription } from "@/models/Subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log(`[Stripe Webhook] ${event.type}`);

    try {
        await connectToDatabase();

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("[Webhook Handler Error]", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const customerId = session.customer as string;

    if (!userId) {
        console.error("No userId in checkout session metadata");
        return;
    }

    // Get the subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
        session.subscription as string
    );

    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
        console.error(`Subscription not found for user ${userId}`);
        return;
    }

    subscription.plan = "pro";
    subscription.status = "active";
    subscription.stripeCustomerId = customerId;
    subscription.stripeSubscriptionId = stripeSubscription.id;
    subscription.stripePriceId = stripeSubscription.items.data[0].price.id;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    subscription.cancelAtPeriodEnd = false;

    await subscription.save();

    console.log(`✅ Subscription activated for user ${userId}`);
}

async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await Subscription.findOne({
        stripeSubscriptionId: stripeSubscription.id,
    });

    if (!subscription) {
        console.error(`Subscription not found: ${stripeSubscription.id}`);
        return;
    }

    // Update subscription details
    subscription.status = stripeSubscription.status as any;
    subscription.stripePriceId = stripeSubscription.items.data[0].price.id;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

    // If subscription is canceled or past_due, downgrade to free
    if (stripeSubscription.status === "canceled" || stripeSubscription.status === "unpaid") {
        subscription.plan = "free";
    }

    await subscription.save();

    console.log(`✅ Subscription updated: ${stripeSubscription.id}`);
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await Subscription.findOne({
        stripeSubscriptionId: stripeSubscription.id,
    });

    if (!subscription) {
        console.error(`Subscription not found: ${stripeSubscription.id}`);
        return;
    }

    // Downgrade to free plan
    subscription.plan = "free";
    subscription.status = "canceled";
    subscription.stripeSubscriptionId = undefined;
    subscription.stripePriceId = undefined;
    subscription.currentPeriodEnd = undefined;

    await subscription.save();

    console.log(`✅ Subscription canceled: ${stripeSubscription.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await Subscription.findOne({
        stripeCustomerId: invoice.customer as string,
    });

    if (!subscription) {
        console.error(`Subscription not found for customer: ${invoice.customer}`);
        return;
    }

    subscription.status = "past_due";
    await subscription.save();

    console.log(`⚠️ Payment failed for subscription: ${subscription._id}`);
}
