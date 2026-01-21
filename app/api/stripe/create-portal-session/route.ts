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

        const subscription = await Subscription.findOne({ userId });
        
        if (!subscription?.stripeCustomerId) {
            return NextResponse.json(
                { error: "No active subscription found" },
                { status: 400 }
            );
        }

        // Create portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("[Stripe Portal Error]", error);
        return NextResponse.json(
            { error: error.message || "Failed to create portal session" },
            { status: 500 }
        );
    }
}
