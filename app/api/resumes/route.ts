import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Resume } from "@/models/Resume";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const newResume = await Resume.create({
            // @ts-ignore
            userId: session.user.id,
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

        return NextResponse.json(newResume, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating resume" }, { status: 500 });
    }
}
