"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, CreditCard, TrendingUp, Zap } from "lucide-react";
import { PLANS, PlanType } from "@/lib/plans";

type SubscriptionData = {
    plan: PlanType;
    status: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd: boolean;
    usage: {
        atsChecks: number;
        aiTailors: number;
        resumes: number;
        portfolios: number;
    };
    limits: {
        atsChecks: number;
        aiTailors: number;
        resumes: number;
        portfolios: number;
    };
};

export default function BillingClient() {
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await fetch("/api/subscription");
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        } catch (error) {
            console.error("Failed to fetch subscription", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async () => {
        setActionLoading(true);
        try {
            const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || PLANS.pro.stripePriceId;
            
            const res = await fetch("/api/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });

            if (res.ok) {
                const { url } = await res.json();
                window.location.href = url;
            } else {
                alert("Failed to create checkout session");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setActionLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/stripe/create-portal-session", {
                method: "POST",
            });

            if (res.ok) {
                const { url } = await res.json();
                window.location.href = url;
            } else {
                alert("Failed to open billing portal");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load subscription</p>
            </div>
        );
    }

    const isPro = subscription.plan === "pro";
    const usagePercentage = {
        atsChecks: (subscription.usage.atsChecks / subscription.limits.atsChecks) * 100,
        aiTailors: (subscription.usage.aiTailors / subscription.limits.aiTailors) * 100,
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your subscription and view usage statistics
                </p>
            </div>

            {/* Current Plan Card */}
            <Card className={isPro ? "border-primary" : ""}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {isPro ? (
                                    <>
                                        <Zap className="h-5 w-5 text-primary" />
                                        Pro Plan
                                    </>
                                ) : (
                                    "Free Plan"
                                )}
                            </CardTitle>
                            <CardDescription>
                                {isPro ? (
                                    subscription.cancelAtPeriodEnd ? (
                                        `Cancels on ${new Date(subscription.currentPeriodEnd!).toLocaleDateString()}`
                                    ) : (
                                        `Renews on ${new Date(subscription.currentPeriodEnd!).toLocaleDateString()}`
                                    )
                                ) : (
                                    "Upgrade to unlock more features"
                                )}
                            </CardDescription>
                        </div>
                        <Badge variant={isPro ? "default" : "secondary"}>
                            {subscription.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* ATS Usage */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ATS Checks</span>
                                <span className="font-medium">
                                    {subscription.usage.atsChecks} / {subscription.limits.atsChecks}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all"
                                    style={{ width: `${Math.min(usagePercentage.atsChecks, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* AI Tailoring Usage */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">AI Tailoring</span>
                                <span className="font-medium">
                                    {subscription.usage.aiTailors} / {subscription.limits.aiTailors}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all"
                                    style={{ width: `${Math.min(usagePercentage.aiTailors, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Resumes */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Resumes</span>
                                <span className="font-medium">
                                    {subscription.usage.resumes} / {subscription.limits.resumes}
                                </span>
                            </div>
                        </div>

                        {/* Portfolios */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Portfolios</span>
                                <span className="font-medium">
                                    {subscription.usage.portfolios} / {subscription.limits.portfolios}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {isPro ? (
                        <Button
                            variant="outline"
                            onClick={handleManageSubscription}
                            disabled={actionLoading}
                            className="w-full"
                        >
                            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Subscription
                        </Button>
                    ) : (
                        <Button
                            onClick={handleUpgrade}
                            disabled={actionLoading}
                            className="w-full bg-gradient-to-r from-primary to-emerald-500 text-white"
                        >
                            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Upgrade to Pro - ${PLANS.pro.price}/month
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Feature Comparison */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Free Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <CardDescription>Perfect for getting started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {PLANS.free.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Pro Plan
                        </CardTitle>
                        <CardDescription>For serious job seekers</CardDescription>
                        <div className="text-3xl font-bold">${PLANS.pro.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {PLANS.pro.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    {!isPro && (
                        <CardFooter>
                            <Button
                                onClick={handleUpgrade}
                                disabled={actionLoading}
                                className="w-full bg-gradient-to-r from-primary to-emerald-500 text-white"
                            >
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upgrade Now
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
