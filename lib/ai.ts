import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function generateTailoredContent(resumeText: string, jobDescription: string) {
    if (!API_KEY) {
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
            const genAI = new GoogleGenerativeAI(API_KEY);
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
