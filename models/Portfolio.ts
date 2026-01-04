import mongoose, { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, default: "My Portfolio" },
        subdomain: { type: String, unique: true, sparse: true }, // e.g. "john" -> john.resumetailor.com (simulated)
        templateId: { type: String, default: "premium-1" },
        content: {
            hero: {
                title: String,
                subtitle: String,
                ctaText: String,
                ctaLink: String,
                backgroundImage: String
            },
            about: {
                title: String,
                description: String,
                image: String
            },
            projects: [
                {
                    title: String,
                    description: String,
                    imageUrl: String,
                    link: String,
                    tags: [String]
                }
            ],
            contact: {
                email: String,
                socials: {
                    twitter: String,
                    linkedin: String,
                    github: String
                }
            }
        },
        isPublished: { type: Boolean, default: false },
        themeConfig: {
            primaryColor: String,
            fontFamily: String
        }
    },
    { timestamps: true }
);

export const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema);
