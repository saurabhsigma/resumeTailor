import mongoose, { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, default: "My Resume" },
        personalInfo: {
            fullName: String,
            email: String,
            phone: String,
            location: String,
            website: String,
            linkedin: String,
            github: String,
        },
        summary: { type: String },
        experience: [
            {
                company: String,
                role: String,
                startDate: String,
                endDate: String,
                current: Boolean,
                description: String, // Can be markdown or bullet points
            }
        ],
        education: [
            {
                school: String,
                degree: String,
                field: String,
                startDate: String,
                endDate: String,
            }
        ],
        skills: [String],
        projects: [
            {
                name: String,
                description: String,
                url: String,
                technologies: [String]
            }
        ],
        theme: { type: String, default: "modern" }, // modern, classic, minimal
        customCss: { type: String },
    },
    { timestamps: true }
);

export const Resume = models.Resume || model("Resume", ResumeSchema);
