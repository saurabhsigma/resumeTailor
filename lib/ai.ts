
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function generateTailoredContent(resumeText: string, jobDescription: string) {
    if (!HF_API_KEY) {
        // Fallback or Mock if no key
        return `[MOCK AI RESPONSE - No API Key Configured]
Based on the job description, here are some tailored suggestions:
1. Emphasize your experience with ${jobDescription.slice(0, 20)}...
2. Update your summary to mention...`;
    }

    const prompt = `
    Role: Professional Resume Writer.
    Task: Tailor the following resume content to match the job description.
    
    Job Description:
    ${jobDescription}

    Resume Content:
    ${resumeText}

    Output:
    Provide a revised Professional Summary and 3-5 tailored bullet points for Key Achievements that align with the job requirements.
    `;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
            headers: { Authorization: `Bearer ${HF_API_KEY}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 500 } }),
        });

        const result = await response.json();
        return result[0]?.generated_text || result?.generated_text || "Failed to generate text.";
    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("Failed to communicate with AI service.");
    }
}
