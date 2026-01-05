import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        clientId: { type: Schema.Types.ObjectId, ref: "Client" },
        name: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
        budget: { type: Number },
        deadline: { type: Date },
        tags: [String],
        // Add other fields as needed
    },
    { timestamps: true }
);

export const Project = models.Project || model("Project", ProjectSchema);
