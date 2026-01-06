import { Groq } from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

export type AtsAnalysis = {
    matchScore: number;
    missingKeywords: string[];
    profileSummary: string;
    suggestions: string;
    applicationSuccessRate: number;
    rawText: string;
    modelUsed?: string;
};

function clampScore(value: number) {
    if (Number.isNaN(value)) return 0;
    return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeAtsPayload(payload: any, rawText: string, modelUsed?: string): AtsAnalysis {
    const matchScore = clampScore(Number(payload?.matchScore ?? payload?.match ?? payload?.jobDescriptionMatch));
    const applicationSuccessRate = clampScore(Number(payload?.applicationSuccessRate ?? payload?.successRate ?? payload?.success ?? payload?.applicationScore));
    const missingKeywords = Array.isArray(payload?.missingKeywords)
        ? payload.missingKeywords.map((kw: any) => String(kw)).filter(Boolean)
        : typeof payload?.missingKeywords === "string"
            ? payload.missingKeywords.split(/,|\n/).map((kw: string) => kw.trim()).filter(Boolean)
            : [];

    return {
        matchScore,
        applicationSuccessRate,
        missingKeywords,
        profileSummary: String(payload?.profileSummary || payload?.summary || ""),
        suggestions: String(payload?.suggestions || payload?.improvements || rawText || ""),
        rawText,
        modelUsed,
    };
}

async function callGroqAts(resumeText: string, jobDescription: string): Promise<AtsAnalysis> {
    if (!GROQ_API_KEY) {
        throw new Error("Missing GROQ_API_KEY");
    }

    const client = new Groq({ apiKey: GROQ_API_KEY });

    const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.15,
        max_output_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: `You are a deterministic ATS evaluator. Return structured JSON only.
Format strictly as:
{
  "matchScore": number 0-100,
  "missingKeywords": string[],
  "profileSummary": string,
  "suggestions": string,
  "applicationSuccessRate": number 0-100,
  "rawText": string
}
Use the same output for identical inputs. Do not add additional fields or prose.`
            },
            {
                role: "user",
                content: `RESUME:\n${resumeText}\n\nJOB_DESCRIPTION:\n${jobDescription}`
            }
        ]
    });

    const message = completion.choices[0]?.message?.content;
    if (!message) {
        throw new Error("Empty Groq response");
    }

    const parsed = JSON.parse(message);
    return normalizeAtsPayload(parsed, message, "groq:llama-3.3-70b-versatile");
}

async function callGeminiAts(resumeText: string, jobDescription: string): Promise<AtsAnalysis> {
    if (!GEMINI_API_KEY) {
        throw new Error("Missing GOOGLE_API_KEY");
    }

    const modelsToTry = ["models/gemini-1.5-flash", "gemini-1.5-flash", "models/gemini-1.5-pro", "gemini-1.5-pro", "models/gemini-pro", "gemini-pro"];

    for (const modelName of modelsToTry) {
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `Act as a deterministic ATS. Return only JSON with keys: matchScore (0-100), missingKeywords (array), profileSummary (string), suggestions (string), applicationSuccessRate (0-100), rawText (string echo of your explanation). Do not add markdown.

RESUME:
${resumeText}

JOB_DESCRIPTION:
${jobDescription}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonStart = text.indexOf("{");
            const jsonEnd = text.lastIndexOf("}");
            if (jsonStart === -1 || jsonEnd === -1) {
                continue;
            }
            const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
            return normalizeAtsPayload(parsed, text, modelName);
        } catch (error) {
            // try next model
        }
    }

    throw new Error("All Gemini models failed");
}

export async function generateAtsAnalysis(resumeText: string, jobDescription: string): Promise<AtsAnalysis> {
    const cleanedResume = (resumeText || "").trim();
    const cleanedJd = (jobDescription || "").trim();

    if (!cleanedResume || !cleanedJd) {
        throw new Error("Missing resume or job description");
    }

    try {
        return await callGroqAts(cleanedResume, cleanedJd);
    } catch (groqError) {
        // fallback to Gemini
    }

    try {
        return await callGeminiAts(cleanedResume, cleanedJd);
    } catch (geminiError) {
        // fallback to mock
    }

    const summary = `Based on the provided resume and JD, focus on aligning achievements to the top requirements: ${cleanedJd.slice(0, 120)}...`;
    return {
        matchScore: 55,
        applicationSuccessRate: 50,
        missingKeywords: [],
        profileSummary: summary,
        suggestions: "Add quantifiable impact metrics, mirror exact JD keywords, and ensure your top 5 skills are prominent in the summary.",
        rawText: "Using mock ATS output because all model calls failed.",
        modelUsed: "mock",
    };
}

export async function generateTailoredContent(resumeText: string, jobDescription: string) {
    if (!GEMINI_API_KEY) {
        console.warn("GOOGLE_API_KEY not found in environment variables.");
        return `[MOCK AI RESPONSE - No API Key Configured]
Based on the job description, here are some tailored suggestions:
1. Emphasize your experience with ${jobDescription.slice(0, 20)}...
2. Update your summary to mention specific skills relevant to the role.
3. Highlight your achievements in previous roles that match the requirements.`;
    }

    const modelsToTry = ["models/gemini-1.5-flash", "gemini-1.5-flash", "models/gemini-1.5-pro", "gemini-1.5-pro", "models/gemini-pro", "gemini-pro"];

    for (const modelName of modelsToTry) {
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
            Role: Professional Resume Writer.
            Task: Tailor the following resume content to match the job description.
            
            Job Description:
            ${jobDescription}

            Resume Content:
            ${resumeText}

            Output Guidelines:
            1. Provide a revised Professional Summary (max 3-4 lines).
            2. Provide 3-5 tailored bullet points for Key Achievements that strictly align with the job requirements.
            3. Do NOT include any conversational text like "Here is your resume". Just the content.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text || "Failed to generate text.";
        } catch (error: any) {
            // Silently continue to next model
        }
    }

    // If all models fail
    console.warn("AI Warning: All Gemini models failed (likely API key permissions or region). Using mock data.");
    return `[AI Generation Failed - Using Mock Data]
Based on the job description, here are some tailored suggestions:
1. Emphasize your experience with ${jobDescription.slice(0, 20)}...
2. Update your summary to mention specific skills relevant to the role.
3. Highlight your achievements in previous roles that match the requirements.`;
}
