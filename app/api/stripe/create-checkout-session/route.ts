import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth } from "@/lib/subscription";
import connectToDatabase from "@/lib/db";
import { Subscription } from "@/models/Subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
    try {
        const userId = await requireAuth();
        await connectToDatabase();

        const { priceId } = await req.json();
        
        if (!priceId) {
            return NextResponse.json({ error: "Price ID required" }, { status: 400 });
        }

        // Get or create subscription record
        let subscription = await Subscription.findOne({ userId });
        if (!subscription) {
            subscription = await Subscription.create({
                userId,
                plan: "free",
                status: "active",
            });
        }

        // Create or retrieve Stripe customer
        let customerId = subscription.stripeCustomerId;
        
        if (!customerId) {
            const customer = await stripe.customers.create({
                metadata: {
                    userId: userId,
                },
            });
            customerId = customer.id;
            subscription.stripeCustomerId = customerId;
            await subscription.save();
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing?canceled=true`,
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error("[Stripe Checkout Error]", error);
        return NextResponse.json(
            { error: error.message || "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
