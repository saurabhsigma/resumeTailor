import mongoose, { Schema, model, models } from "mongoose";

const ClientSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String },
        website: { type: String },
        notes: { type: String },
        // Add other fields as needed
    },
    { timestamps: true }
);

export const Client = models.Client || model("Client", ClientSchema);
