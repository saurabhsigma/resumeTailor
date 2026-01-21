import { NextResponse } from "next/server";
import { getAuthUserSubscription } from "@/lib/subscription";
import { getPlanLimits } from "@/lib/plans";

export async function GET() {
    try {
        const subscription = await getAuthUserSubscription();
        const limits = getPlanLimits(subscription.plan as any);

        return NextResponse.json({
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            usage: subscription.usageThisMonth,
            limits,
        });
    } catch (error: any) {
        console.error("[Subscription API Error]", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch subscription" },
            { status: error.message === "Unauthorized" ? 401 : 500 }
        );
    }
}
