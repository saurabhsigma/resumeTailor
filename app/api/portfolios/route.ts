import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { v4 as uuidv4 } from 'uuid';
import { checkUsageLimit, incrementUsage } from "@/lib/subscription";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        
        // @ts-ignore
        const userId = session.user.id;
        
        // Check usage limit
        const usageCheck = await checkUsageLimit(userId, "portfolios");
        if (!usageCheck.allowed) {
            return NextResponse.json(
                {
                    error: "limit_reached",
                    message: "Portfolio creation limit reached for your plan",
                    current: usageCheck.current,
                    limit: usageCheck.limit,
                    plan: usageCheck.plan,
                },
                { status: 403 }
            );
        }
        
        // Generate a random unique subdomain initially
        const subdomain = `user-${Date.now()}`;

        const newPortfolio = await Portfolio.create({
            userId,
            title: "My Creative Portfolio",
            subdomain: subdomain,
            content: {
                hero: {
                    title: "Hello, I'm " + (session.user.name || "a Creator"),
                    subtitle: "Digital Designer & Developer",
                    ctaText: "Get in Touch",
                    ctaLink: "#contact"
                },
                about: {
                    title: "About Me",
                    description: "I am a passionate creator building digital experiences."
                },
                projects: [],
                contact: {
                    email: session.user.email,
                }
            }
        });
        
        // Increment usage counter
        await incrementUsage(userId, "portfolios");

        return NextResponse.json(newPortfolio, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating portfolio" }, { status: 500 });
    }
}
