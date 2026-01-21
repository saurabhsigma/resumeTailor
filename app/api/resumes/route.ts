import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Resume } from "@/models/Resume";
import { checkUsageLimit, incrementUsage, requireAuth } from "@/lib/subscription";

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
        const usageCheck = await checkUsageLimit(userId, "resumes");
        if (!usageCheck.allowed) {
            return NextResponse.json(
                {
                    error: "limit_reached",
                    message: "Resume creation limit reached for your plan",
                    current: usageCheck.current,
                    limit: usageCheck.limit,
                    plan: usageCheck.plan,
                },
                { status: 403 }
            );
        }
        
        const newResume = await Resume.create({
            userId,
            title: "Untitled Resume",
            personalInfo: {
                fullName: session.user.name || "Your Name",
                email: session.user.email || "email@example.com",
            },
            experience: [],
            education: [],
            skills: [],
            projects: []
        });
        
        // Increment usage counter
        await incrementUsage(userId, "resumes");

        return NextResponse.json(newResume, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating resume" }, { status: 500 });
    }
}
