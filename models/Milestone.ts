import mongoose, { Schema, model, models } from "mongoose";

const MilestoneSchema = new Schema(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        title: { type: String, required: true },
        description: { type: String },
        amount: { type: Number, required: true },
        dueDate: { type: Date },
        status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    },
    { timestamps: true }
);

export const Milestone = models.Milestone || model("Milestone", MilestoneSchema);
