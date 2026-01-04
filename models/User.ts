import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        image: { type: String },
        resumes: [{ type: Schema.Types.ObjectId, ref: "Resume" }],
        portfolios: [{ type: Schema.Types.ObjectId, ref: "Portfolio" }],
        usage: {
            resumesGenerated: { type: Number, default: 0 },
            portfoliosCreated: { type: Number, default: 0 },
            aiTailorUses: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
