import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { resumeText, jobDescription } = await req.json();

        if (!resumeText || !jobDescription) {
            return NextResponse.json({ message: "Missing input" }, { status: 400 });
        }

        if (!HF_API_KEY) {
            // Mock response if no key configuration
            return NextResponse.json({
                suggestion: "AI API Key is missing. Please configure HUGGINGFACE_API_KEY in .env.local to use the real AI. \n\nMock Suggestion: \n- Updated summary to emphasize technical leadership based on the JD.\n- Added 'React' and 'Next.js' to skills as they were mentioned in the JD."
            });
        }

        // Construct a prompt
        const prompt = `[INST] You are an expert career coach. Tailor the following resume content to match the job description provided. Suggest a revised Professional Summary and 3-5 key bullet points for the Experience section that highlight relevant skills.
        
        RESUME CONTENT:
        ${resumeText.substring(0, 1500)}
        
        JOB DESCRIPTION:
        ${jobDescription.substring(0, 1500)}
        
        Provide the response in a clean, structured format. [/INST]`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 500, return_full_text: false } }),
            }
        );

        if (!response.ok) {
            throw new Error("AI Service Error");
        }

        const result = await response.json();
        const suggestion = result[0]?.generated_text || "No suggestion generated.";

        return NextResponse.json({ suggestion });

    } catch (error) {
        console.error("AI Tailor Error:", error);
        return NextResponse.json({ message: "Error generating content" }, { status: 500 });
    }
}
