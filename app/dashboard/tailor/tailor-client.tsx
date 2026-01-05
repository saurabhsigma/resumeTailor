"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Check, Copy } from "lucide-react";

export default function TailorClient({ resumes }: { resumes: any[] }) {
    const [jobDescription, setJobDescription] = useState("");
    const [currentResumeText, setCurrentResumeText] = useState("");
    const [generatedContent, setGeneratedContent] = useState("");
    const [suggestedTemplate, setSuggestedTemplate] = useState("modern");
    const [isLoading, setIsLoading] = useState(false);

    const handleResumeSelect = (resumeId: string) => {
        const resume = resumes.find(r => r._id === resumeId);
        if (resume) {
            // Flatten resume to text
            const text = `
Name: ${resume.personalInfo?.fullName || ""}
Summary: ${resume.summary || ""}
Experience:
${resume.experience?.map((e: any) => `${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("\n") || ""}
Skills: ${resume.skills?.join(", ") || ""}
Projects:
${resume.projects?.map((p: any) => `${p.title}: ${p.description}`).join("\n") || ""}
            `.trim();
            setCurrentResumeText(text);
        }
    };

    const handleTailor = async () => {
        if (!jobDescription || !currentResumeText) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/tailor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText: currentResumeText,
                    jobDescription
                })
            });
            const data = await res.json();
            if (res.ok) {
                setGeneratedContent(data.suggestion);
                setSuggestedTemplate(data.suggestedTemplate || "modern");
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to generate");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Smart Resume Tailor</h1>
                <p className="text-muted-foreground">Paste your current resume content and the job description. Our AI will suggest tailored summaries and bullet points.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Your Resume Content</CardTitle>
                        <CardDescription>Select a resume or paste text.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={handleResumeSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select from my resumes..." />
                            </SelectTrigger>
                            <SelectContent>
                                {resumes.map((r) => (
                                    <SelectItem key={r._id} value={r._id}>
                                        {r.title || "Untitled Resume"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or paste text</span>
                            </div>
                        </div>

                        <Textarea
                            placeholder="Paste your resume text here (Summary, Experience, Skills)..."
                            className="h-[300px]"
                            value={currentResumeText}
                            onChange={(e) => setCurrentResumeText(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. Job Description</CardTitle>
                        <CardDescription>Paste the job description you are applying for.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste the JD here..."
                            className="h-[300px]"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button size="lg" onClick={handleTailor} disabled={isLoading || !jobDescription || !currentResumeText} className="gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    {isLoading ? "Tailoring..." : "Tailor My Resume"}
                </Button>
            </div>

            {generatedContent && (
                <Card className="border-primary shadow-lg">
                    <CardHeader className="bg-primary/5 border-b">
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Wand2 className="h-5 w-5" />
                            Tailored Suggestions
                        </CardTitle>
                        <CardDescription>
                            Based on the job description, we recommend using the <span className="font-bold text-foreground uppercase">{suggestedTemplate}</span> template.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap border font-mono text-sm leading-relaxed">
                            {generatedContent}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                Recommended Design: <span className="font-bold capitalize text-primary">{suggestedTemplate}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Suggestions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
