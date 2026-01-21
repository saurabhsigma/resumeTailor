"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, FileUp, Gauge, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type AtsAnalysis = {
    matchScore: number;
    missingKeywords: string[];
    profileSummary: string;
    suggestions: string;
    applicationSuccessRate: number;
    rawText: string;
    modelUsed?: string;
};

export default function AtsClient({ resumes }: { resumes: any[] }) {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [phase, setPhase] = useState<"idle" | "upload" | "processing">("idle");
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [limitInfo, setLimitInfo] = useState<{ current: number; limit: number; plan: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const canSubmit = !!jobDescription.trim() && (!!resumeText.trim() || !!resumeFile);

    const formattedResumeOptions = useMemo(
        () =>
            resumes.map((r) => ({
                id: r._id,
                label: r.title || "Untitled Resume",
                text: formatResumeToText(r),
            })),
        [resumes]
    );

    const handleResumeSelect = (resumeId: string) => {
        const selected = formattedResumeOptions.find((item) => item.id === resumeId);
        if (selected) {
            setResumeText(selected.text);
        }
    };

    const handleFileChange = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) {
            setResumeFile(null);
            return;
        }
        const file = fileList[0];
        const MAX_MB = 20;
        if (file.type !== "application/pdf") {
            setError("Only PDF files are supported");
            setResumeFile(null);
            return;
        }
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`File too large. Max ${MAX_MB}MB.`);
            setResumeFile(null);
            return;
        }
        setError("");
        setResumeFile(file);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsLoading(true);
        setError("");
        setAnalysis(null);

        try {
            if (resumeFile) {
                // Use XHR to track upload progress
                setPhase("upload");
                setUploadProgress(0);
                const formData = new FormData();
                formData.append("jobDescription", jobDescription);
                if (resumeText.trim()) formData.append("resumeText", resumeText);
                formData.append("resumeFile", resumeFile);

                const xhr = new XMLHttpRequest();
                const promise = new Promise<Response>((resolve, reject) => {
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const pct = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(pct);
                        }
                    };
                    xhr.onloadstart = () => setUploadProgress(0);
                    xhr.onerror = () => reject(new Error("Network error during upload"));
                    xhr.onload = () => {
                        // After upload completes, we're processing on server
                        setPhase("processing");
                        try {
                            const status = xhr.status;
                            const text = xhr.responseText || "{}";
                            const payload = JSON.parse(text);
                            if (status >= 200 && status < 300) {
                                resolve(new Response(JSON.stringify(payload), { status }));
                            } else {
                                reject(new Error(payload?.message || `ATS check failed (${status})`));
                            }
                        } catch (e: any) {
                            reject(new Error("Invalid server response"));
                        }
                    };
                    xhr.open("POST", "/api/ats", true);
                    xhr.send(formData);
                });

                const response = await promise;
                const payload = await response.json();
                setAnalysis(payload.analysis);
            } else {
                const response = await fetch("/api/ats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeText, jobDescription }),
                });
                const payload = await response.json();
                if (response.status === 403 && payload.error === "limit_reached") {
                    setLimitInfo({ current: payload.current, limit: payload.limit, plan: payload.plan });
                    setShowUpgradeDialog(true);
                    return;
                }
                if (!response.ok) throw new Error(payload?.message || "ATS check failed");
                setAnalysis(payload.analysis);
            }
        } catch (err: any) {
            setError(err?.message || "Something went wrong while running the ATS check");
        } finally {
            setIsLoading(false);
            setPhase("idle");
            setUploadProgress(0);
        }
    };

    const copyOutput = async () => {
        if (!analysis) return;
        const text = `Job Description Match: ${analysis.matchScore}%\nApplication Success Rate: ${analysis.applicationSuccessRate}%\nMissing Keywords: ${analysis.missingKeywords.join(", ") || "None"}\nProfile Summary: ${analysis.profileSummary}\nSuggestions: ${analysis.suggestions}`;
        await navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                    <p className="text-sm uppercase tracking-widest text-primary font-semibold">ATS Score Checker</p>
                    <h1 className="text-3xl font-bold tracking-tight">Check how your resume matches any job</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Pick one of your saved resumes or drop a PDF/paste text, add the job description, and get a structured ATS analysis powered by Groq.
                    </p>
                </div>
                {analysis?.modelUsed && (
                    <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-md border">
                        Model: {analysis.modelUsed}
                    </div>
                )}
            </div>

            <Tabs defaultValue="saved">
                <TabsList>
                    <TabsTrigger value="saved">Use my resumes</TabsTrigger>
                    <TabsTrigger value="custom">Upload / paste</TabsTrigger>
                </TabsList>

                <TabsContent value="saved">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select a saved resume</CardTitle>
                            <CardDescription>We will flatten it to text for the ATS check.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select onValueChange={handleResumeSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose one of your resumes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {formattedResumeOptions.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                className="h-40"
                                placeholder="We auto-fill from your selection. You can still tweak the text."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="custom">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload a PDF or paste text</CardTitle>
                            <CardDescription>
                                You can upload just a PDF (no need to paste) and we'll extract text automatically. Or paste/edit the text below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <FileUp className="h-4 w-4" /> PDF Resume (optional)
                                </Label>
                                <div
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`rounded-md border-2 border-dashed p-6 text-center cursor-pointer transition ${
                                        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:bg-muted/50"
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        id="resume-file"
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e.target.files)}
                                    />
                                    {resumeFile ? (
                                        <div className="text-sm">
                                            <p className="font-medium">{resumeFile.name}</p>
                                            <p className="text-muted-foreground">
                                                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Drag & drop a PDF here, or click to browse (max 20MB)
                                        </div>
                                    )}
                                </div>
                                {isLoading && resumeFile && (
                                    <div className="mt-2">
                                        {phase === "upload" ? (
                                            <div>
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                    <span>Uploading...</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <div className="w-full h-2 rounded bg-muted overflow-hidden">
                                                    <div
                                                        className="h-2 bg-primary transition-all"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : phase === "processing" ? (
                                            <div>
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                    <span>Extracting and analyzing...</span>
                                                    <span>Working</span>
                                                </div>
                                                <div className="w-full h-2 rounded bg-muted overflow-hidden">
                                                    <div className="h-2 bg-gradient-to-r from-primary to-emerald-400 animate-pulse w-1/2" />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            <Textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                className="h-40"
                                placeholder="Optional: paste resume text (we auto-extract from PDF if uploaded)."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Job description</CardTitle>
                    <CardDescription>Paste the JD to compute alignment and missing keywords.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="h-40"
                        placeholder="Paste the role requirements, responsibilities, and must-have skills."
                    />
                </CardContent>
            </Card>

            <div className="flex items-center gap-3">
                <Button size="lg" disabled={!canSubmit || isLoading} onClick={handleSubmit} className="gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isLoading ? "Crunching ATS score..." : "Check ATS Score"}
                </Button>
                {analysis && (
                    <Button type="button" variant="outline" size="lg" onClick={copyOutput} className="gap-2">
                        <Copy className="h-4 w-4" /> Copy result
                    </Button>
                )}
                {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            {analysis && (
                <Card className="border-primary/50 shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase">
                            <ShieldCheck className="h-4 w-4" /> ATS Analysis
                        </div>
                        <CardTitle className="text-2xl">Job match insights</CardTitle>
                        <CardDescription>Scores are deterministic for the same inputs. Use them to iterate quickly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <ScoreBlock label="Job Description Match" value={analysis.matchScore} icon={<Gauge className="h-4 w-4" />} />
                            <ScoreBlock label="Application Success Rate" value={analysis.applicationSuccessRate} icon={<Sparkles className="h-4 w-4" />} />
                        </div>

                        <div className="space-y-2">
                            <Label>Missing keywords</Label>
                            {analysis.missingKeywords.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No major missing keywords detected. Nice work!</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingKeywords.map((kw) => (
                                        <span key={kw} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/30">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Profile summary</Label>
                            <div className="bg-muted p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap border">
                                {analysis.profileSummary || "No summary generated."}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Personalized suggestions</Label>
                            <div className="bg-muted p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap border">
                                {analysis.suggestions || "No suggestions returned."}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            ATS Check Limit Reached
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>
                                You've used {limitInfo?.current || 0} of {limitInfo?.limit || 0} ATS checks this month on the <span className="font-semibold uppercase">{limitInfo?.plan || "free"}</span> plan.
                            </p>
                            <p className="text-foreground font-medium">
                                Upgrade to Pro for 50 ATS checks/month, 30 AI tailoring sessions, and unlimited resumes & portfolios!
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                            Cancel
                        </Button>
                        <Link href="/dashboard/billing">
                            <Button className="gap-2">
                                <Zap className="h-4 w-4" />
                                Upgrade to Pro
                            </Button>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function ScoreBlock({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
    return (
        <div className="p-4 rounded-lg border bg-card space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">{icon}{label}</span>
                <span className="font-semibold text-foreground">{value}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
                <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-emerald-400"
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
            </div>
        </div>
    );
}

function formatResumeToText(resume: any) {
    const experience = Array.isArray(resume.experience)
        ? resume.experience
            .map((e: any) => `${e.role || ""} at ${e.company || ""} (${e.startDate || ""} - ${e.endDate || "Present"}): ${e.description || ""}`.trim())
            .filter(Boolean)
            .join("\n")
        : "";

    const education = Array.isArray(resume.education)
        ? resume.education
            .map((ed: any) => `${ed.degree || ""} in ${ed.field || ""} at ${ed.school || ""} (${ed.startDate || ""} - ${ed.endDate || ""})`.trim())
            .filter(Boolean)
            .join("\n")
        : "";

    const projects = Array.isArray(resume.projects)
        ? resume.projects
            .map((p: any) => `${p.name || p.title || "Project"}: ${p.description || ""} [${(p.technologies || []).join(", ")}]`.trim())
            .filter(Boolean)
            .join("\n")
        : "";

    const skills = Array.isArray(resume.skills) ? resume.skills.join(", ") : "";

    return `Name: ${resume.personalInfo?.fullName || ""}
Summary: ${resume.summary || ""}
Experience:
${experience}
Education:
${education}
Projects:
${projects}
Skills: ${skills}`.trim();
}
