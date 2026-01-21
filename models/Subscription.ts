import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
    plan: "free" | "pro";
    status: "active" | "canceled" | "past_due" | "trialing";
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd: boolean;
    // Usage tracking (resets monthly)
    usageThisMonth: {
        atsChecks: number;
        aiTailors: number;
        resumes: number;
        portfolios: number;
        lastResetDate: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
        },
        status: {
            type: String,
            enum: ["active", "canceled", "past_due", "trialing"],
            default: "active",
        },
        stripeCustomerId: {
            type: String,
            sparse: true,
        },
        stripeSubscriptionId: {
            type: String,
            sparse: true,
        },
        stripePriceId: {
            type: String,
        },
        currentPeriodStart: {
            type: Date,
        },
        currentPeriodEnd: {
            type: Date,
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },
        usageThisMonth: {
            atsChecks: { type: Number, default: 0 },
            aiTailors: { type: Number, default: 0 },
            resumes: { type: Number, default: 0 },
            portfolios: { type: Number, default: 0 },
            lastResetDate: { type: Date, default: Date.now },
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient lookups
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ stripeCustomerId: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
