// Plan limits and pricing configuration
export const PLANS = {
    free: {
        name: "Free",
        price: 0,
        limits: {
            atsChecks: 3, // per month
            aiTailors: 2, // per month
            resumes: 2, // total
            portfolios: 1, // total
        },
        features: [
            "2 Resume templates",
            "1 Portfolio website",
            "3 ATS checks/month",
            "2 AI tailoring/month",
            "Basic support",
        ],
    },
    pro: {
        name: "Pro",
        price: 9.99, // USD per month
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "", // Set in env
        limits: {
            atsChecks: 50, // per month
            aiTailors: 30, // per month
            resumes: 20, // total
            portfolios: 10, // total
        },
        features: [
            "Unlimited resume templates",
            "10 Portfolio websites",
            "50 ATS checks/month",
            "30 AI tailoring/month",
            "Priority support",
            "Custom domains",
            "Analytics dashboard",
        ],
    },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanLimits(plan: PlanType) {
    return PLANS[plan].limits;
}

export function getPlanFeatures(plan: PlanType) {
    return PLANS[plan].features;
}
