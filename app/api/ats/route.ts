import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { generateAtsAnalysis } from "@/lib/ai";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export const runtime = "nodejs";

async function extractPdfText(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // pdf-parse v1.1.1 is defined as a CommonJS module with a default export function
    // We use createRequire to import it reliably in this environment
    // update: we import 'pdf-parse/lib/pdf-parse.js' directly because the main 'index.js'
    // contains a bug where it checks `!module.parent` and tries to run a test file if true.
    // In bundled environments like Next.js, module.parent is often undefined, triggering this bug.
    const mod = require("pdf-parse/lib/pdf-parse.js");
    const pdfParse = (mod as any).default ?? mod;

    if (typeof pdfParse !== "function") {
        throw new Error("pdf-parse import did not return a function");
    }

    const parsed = await pdfParse(buffer);
    return (parsed?.text || "").trim();
}

export async function POST(req: Request) {
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
                if (!pdfText) {
                    return NextResponse.json({ message: "Could not read text from the uploaded PDF" }, { status: 400 });
                }
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