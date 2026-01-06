import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { generateAtsAnalysis } from "@/lib/ai";

export const runtime = "nodejs";

async function extractPdfText(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        
        // Dynamic import to avoid Next.js build issues
        const pdfjsLib = await import("pdfjs-dist");
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            fullText += pageText + "\n";
        }
        
        return fullText.trim();
    } catch (err) {
        console.error("PDF parsing error:", err);
        return "";
    }
}export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const contentType = req.headers.get("content-type") || "";
        let resumeText = "";
        let jobDescription = "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("resumeFile");
            const providedText = formData.get("resumeText");
            const jd = formData.get("jobDescription");

            jobDescription = jd ? String(jd) : "";
            resumeText = providedText ? String(providedText) : "";

            if (file && file instanceof File) {
                const pdfText = await extractPdfText(file);
                // PDF text extraction not reliable; user must paste text alongside upload
                resumeText = [resumeText, pdfText].filter(Boolean).join("\n\n").trim();
            }
        } else {
            const body = await req.json();
            resumeText = body?.resumeText || "";
            jobDescription = body?.jobDescription || "";
        }

        if (!jobDescription.trim()) {
            return NextResponse.json({ message: "Job description is required" }, { status: 400 });
        }
        if (!resumeText.trim()) {
            return NextResponse.json({ message: "Resume text is required (paste text or upload PDF)" }, { status: 400 });
        }

        const analysis = await generateAtsAnalysis(resumeText, jobDescription);
        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error("ATS API error", error);
        return NextResponse.json({ message: "Failed to run ATS check" }, { status: 500 });
    }
}