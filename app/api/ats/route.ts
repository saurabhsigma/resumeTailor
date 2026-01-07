import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { generateAtsAnalysis } from "@/lib/ai";

export const runtime = "nodejs";

async function extractPdfText(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);

        // Robust import: try multiple pdfjs-dist entry points across versions
        const candidates = [
            "pdfjs-dist/legacy/build/pdf.js",
            "pdfjs-dist/build/pdf.mjs",
            "pdfjs-dist/build/pdf.js",
            "pdfjs-dist"
        ];
        let loaded: any = null;
        for (const path of candidates) {
            try {
                loaded = await import(path);
                break;
            } catch (_err) {
                // try next candidate
            }
        }
        if (!loaded) {
            throw new Error("Failed to load pdfjs-dist module");
        }
        const lib: any = (loaded as any).getDocument ? loaded : (loaded as any).default || loaded;

        // Ensure fake worker can locate a worker script when disableWorker is true
        try {
            const workerCandidates = [
                "pdfjs-dist/legacy/build/pdf.worker.js",
                "pdfjs-dist/build/pdf.worker.js",
            ];
            for (const w of workerCandidates) {
                try {
                    const workerMod: any = await import(w);
                    // Some bundlers expose URL on default export
                    const workerSrc = (workerMod && (workerMod.default || workerMod)) as any;
                    if (lib.GlobalWorkerOptions) {
                        lib.GlobalWorkerOptions.workerSrc = workerSrc as any;
                    }
                    break;
                } catch {
                    // continue trying next
                }
            }
        } catch {
            // Non-fatal: we'll still attempt with disableWorker below
        }

        const loadingTask = lib.getDocument({
            data: typedArray,
            disableWorker: true,
            isEvalSupported: false,
        });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
        }

        return fullText.trim();
    } catch (err) {
        console.error("PDF parsing error:", err);
        console.error("PDF parsing failed. File name:", file.name, "Size:", file.size);
        // Return empty string to allow fallback to manual text input
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

        console.log("[ATS API] Request received, content-type:", contentType);

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("resumeFile");
            const providedText = formData.get("resumeText");
            const jd = formData.get("jobDescription");

            jobDescription = jd ? String(jd) : "";
            resumeText = providedText ? String(providedText) : "";

            console.log("[ATS API] Has file:", !!file, "Has text:", !!resumeText, "JD length:", jobDescription.length);

            let hadFile = false;
            if (file && file instanceof File) {
                hadFile = true;
                const pdfText = await extractPdfText(file);
                resumeText = [resumeText, pdfText].filter(Boolean).join("\n\n").trim();
                if (!resumeText) {
                    return NextResponse.json({ message: "Couldn't extract text from the uploaded PDF. Try another file or paste the resume text instead." }, { status: 400 });
                }
            }
        } else {
            const body = await req.json();
            resumeText = body?.resumeText || "";
            jobDescription = body?.jobDescription || "";
            console.log("[ATS API] JSON request - Resume length:", resumeText.length, "JD length:", jobDescription.length);
        }

        if (!jobDescription.trim()) {
            console.log("[ATS API] Error: Missing job description");
            return NextResponse.json({ message: "Job description is required" }, { status: 400 });
        }
        if (!resumeText.trim()) {
            console.log("[ATS API] Error: Missing resume text");
            return NextResponse.json({ message: "Resume text is required. Upload a PDF or paste the resume content." }, { status: 400 });
        }

        console.log("[ATS API] Calling generateAtsAnalysis...");
        const analysis = await generateAtsAnalysis(resumeText, jobDescription);
        console.log("[ATS API] Analysis complete, match score:", analysis.matchScore);
        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error("[ATS API] Error:", error.message, error.stack);
        return NextResponse.json({ message: "Failed to run ATS check: " + error.message }, { status: 500 });
    }
}