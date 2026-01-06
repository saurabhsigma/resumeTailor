"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, FileUp, Gauge, Loader2, ShieldCheck, Sparkles } from "lucide-react";

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
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file");
            setResumeFile(null);
            return;
        }
        setError("");
        setResumeFile(file);
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsLoading(true);
        setError("");
        setAnalysis(null);

        try {
            let response: Response;

            if (resumeFile) {
                const formData = new FormData();
                formData.append("jobDescription", jobDescription);
                if (resumeText.trim()) {
                    formData.append("resumeText", resumeText);
                }
                formData.append("resumeFile", resumeFile);
                response = await fetch("/api/ats", {
                    method: "POST",
                    body: formData,
                });
            } else {
                response = await fetch("/api/ats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeText, jobDescription }),
                });
            }

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload?.message || "ATS check failed");
            }
            setAnalysis(payload.analysis);
        } catch (err: any) {
            setError(err?.message || "Something went wrong while running the ATS check");
        } finally {
            setIsLoading(false);
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
                            <CardDescription>Upload a PDF resume and we'll extract the text automatically. You can also paste or edit text below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="resume-file" className="flex items-center gap-2">
                                    <FileUp className="h-4 w-4" /> PDF Resume (optional)
                                </Label>
                                <Input
                                    id="resume-file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => handleFileChange(e.target.files)}
                                />
                            </div>
                            <Textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                className="h-40"
                                placeholder="Or paste your resume text here (Summary, Experience, Skills, Projects)."
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
