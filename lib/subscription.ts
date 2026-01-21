import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import connectToDatabase from "./db";
import { Subscription, ISubscription } from "@/models/Subscription";
import { getPlanLimits, PlanType } from "./plans";

/**
 * Get or create subscription for a user
 */
export async function getUserSubscription(userId: string): Promise<ISubscription> {
    await connectToDatabase();
    
    let subscription = await Subscription.findOne({ userId });
    
    // Create default free subscription if none exists
    if (!subscription) {
        subscription = await Subscription.create({
            userId,
            plan: "free",
            status: "active",
            usageThisMonth: {
                atsChecks: 0,
                aiTailors: 0,
                resumes: 0,
                portfolios: 0,
                lastResetDate: new Date(),
            },
        });
    }
    
    // Reset usage if month has changed
    const lastReset = new Date(subscription.usageThisMonth.lastResetDate);
    const now = new Date();
    
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        subscription.usageThisMonth = {
            atsChecks: 0,
            aiTailors: 0,
            resumes: 0,
            portfolios: 0,
            lastResetDate: now,
        };
        await subscription.save();
    }
    
    return subscription;
}

/**
 * Check if user has pro plan
 */
export async function isProPlan(userId: string): Promise<boolean> {
    const subscription = await getUserSubscription(userId);
    return subscription.plan === "pro" && subscription.status === "active";
}

/**
 * Require pro plan or throw error
 */
export async function requireProPlan(userId: string): Promise<void> {
    const isPro = await isProPlan(userId);
    if (!isPro) {
        throw new Error("Pro plan required for this feature");
    }
}

/**
 * Check usage limit and return if allowed
 */
export async function checkUsageLimit(
    userId: string,
    feature: "atsChecks" | "aiTailors" | "resumes" | "portfolios"
): Promise<{ allowed: boolean; current: number; limit: number; plan: PlanType }> {
    const subscription = await getUserSubscription(userId);
    const limits = getPlanLimits(subscription.plan as PlanType);
    const current = subscription.usageThisMonth[feature];
    const limit = limits[feature];
    
    return {
        allowed: current < limit,
        current,
        limit,
        plan: subscription.plan as PlanType,
    };
}

/**
 * Increment usage counter
 */
export async function incrementUsage(
    userId: string,
    feature: "atsChecks" | "aiTailors" | "resumes" | "portfolios"
): Promise<void> {
    await connectToDatabase();
    const subscription = await getUserSubscription(userId);
    
    subscription.usageThisMonth[feature] += 1;
    await subscription.save();
}

/**
 * Get current session user ID or throw
 */
export async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    return session.user.id;
}

/**
 * Get subscription info for authenticated user
 */
export async function getAuthUserSubscription(): Promise<ISubscription> {
    const userId = await requireAuth();
    return getUserSubscription(userId);
}
