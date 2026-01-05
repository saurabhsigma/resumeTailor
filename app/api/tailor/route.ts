import { NextResponse } from "next/server";
import { generateTailoredContent } from "@/lib/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { resumeText, jobDescription } = await req.json();

        if (!resumeText || !jobDescription) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const suggestion = await generateTailoredContent(resumeText, jobDescription);

        let suggestedTemplate = "modern";
        const jdLower = jobDescription.toLowerCase();
        if (jdLower.includes("bank") || jdLower.includes("finance") || jdLower.includes("legal") || jdLower.includes("consultant")) {
            suggestedTemplate = "classic";
        } else if (jdLower.includes("designer") || jdLower.includes("creative") || jdLower.includes("artist") || jdLower.includes("ux") || jdLower.includes("ui")) {
            suggestedTemplate = "minimal";
        }

        return NextResponse.json({ suggestion, suggestedTemplate });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
