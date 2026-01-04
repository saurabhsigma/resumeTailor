import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        // Generate a random unique subdomain initially
        const subdomain = `user-${Date.now()}`;

        const newPortfolio = await Portfolio.create({
            // @ts-ignore
            userId: session.user.id,
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

        return NextResponse.json(newPortfolio, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating portfolio" }, { status: 500 });
    }
}
