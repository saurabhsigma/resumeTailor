"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Check, Copy } from "lucide-react";

export default function TailorPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [currentResumeText, setCurrentResumeText] = useState("");
    const [generatedContent, setGeneratedContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                        <CardDescription>Paste the text from your current resume.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                <Card className="border-primary">
                    <CardHeader className="bg-muted/10">
                        <CardTitle className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-primary" />
                            AI Suggestions
                        </CardTitle>
                        <CardDescription>Here are tailored suggestions for your resume. Copy and use them in the editor.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                            {generatedContent}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy to Clipboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
