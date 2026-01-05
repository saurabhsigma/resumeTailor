// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Download, ArrowLeft, Wand2 } from "lucide-react";
import { useRef } from "react";
import { TemplateModern } from "@/components/resume-templates/Modern";
import { TemplateClassic } from "@/components/resume-templates/Classic";
import { TemplateMinimal } from "@/components/resume-templates/Minimal";

const TEMPLATES = {
    modern: TemplateModern,
    classic: TemplateClassic,
    minimal: TemplateMinimal,
};

import { useRouter } from "next/navigation";


export default function ResumeEditor({ initialData }: { initialData: any }) {
    const [resume, setResume] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        // @ts-ignore - React-to-print types might be slightly off for v3 with React 19
        content: () => componentRef.current,
        contentRef: componentRef,
        documentTitle: resume.title || "Resume",
    });

    const handleChange = (section: string, field: string, value: string) => {
        setResume((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section: string, index: number, field: string, value: string) => {
        setResume((prev: any) => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addItem = (section: string, item: any) => {
        setResume((prev: any) => ({
            ...prev,
            [section]: [...prev[section], item]
        }));
    };

    const removeItem = (section: string, index: number) => {
        setResume((prev: any) => {
            const newArray = [...prev[section]];
            newArray.splice(index, 1);
            return { ...prev, [section]: newArray };
        });
    };

    const saveResume = async () => {
        setIsSaving(true);
        try {
            await fetch(`/api/resumes/${resume._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resume)
            });
            // Show toast
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Panel - Editor */}
            <div className="w-1/2 border-r  flex flex-col bg-muted/10">
                <div className="p-4 border-b flex justify-between items-center bg-background">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/resumes">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <Input
                            value={resume.title}
                            onChange={(e) => setResume({ ...resume, title: e.target.value })}
                            className="font-bold border-none shadow-none focus-visible:ring-0 max-w-[200px]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={saveResume} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button size="sm" onClick={handlePrint}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-4 bg-background border-b">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="design">Design</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="content" className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {/* Personal Info */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input value={resume.personalInfo.fullName || ""} onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={resume.personalInfo.email || ""} onChange={(e) => handleChange("personalInfo", "email", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input value={resume.personalInfo.phone || ""} onChange={(e) => handleChange("personalInfo", "phone", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input value={resume.personalInfo.location || ""} onChange={(e) => handleChange("personalInfo", "location", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>LinkedIn</Label>
                                            <Input value={resume.personalInfo.linkedin || ""} onChange={(e) => handleChange("personalInfo", "linkedin", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Website</Label>
                                            <Input value={resume.personalInfo.website || ""} onChange={(e) => handleChange("personalInfo", "website", e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Professional Summary</h3>
                                        <Button variant="outline" size="sm" className="text-xs">
                                            <Wand2 className="mr-2 h-3 w-3" />
                                            AI Enhance
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={resume.summary || ""}
                                        onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>

                            {/* Experience */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Experience</h3>
                                        <Button variant="secondary" size="sm" onClick={() => addItem("experience", { company: "", role: "", startDate: "", endDate: "", description: "" })}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {resume.experience.map((exp: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-4 relative group">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => removeItem("experience", index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Company</Label>
                                                    <Input value={exp.company || ""} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role</Label>
                                                    <Input value={exp.role || ""} onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input value={exp.startDate || ""} onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)} placeholder="MM/YYYY" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input value={exp.endDate || ""} onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)} placeholder="Present" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea value={exp.description || ""} onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Education */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Education</h3>
                                        <Button variant="secondary" size="sm" onClick={() => addItem("education", { school: "", degree: "", startDate: "", endDate: "" })}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {resume.education.map((edu: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-4 relative group">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => removeItem("education", index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>School</Label>
                                                    <Input value={edu.school || ""} onChange={(e) => handleArrayChange("education", index, "school", e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Degree</Label>
                                                    <Input value={edu.degree || ""} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input value={edu.startDate || ""} onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)} placeholder="MM/YYYY" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input value={edu.endDate || ""} onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)} placeholder="MM/YYYY" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Skills */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg">Skills</h3>
                                    <Textarea
                                        value={resume.skills.join(", ")}
                                        onChange={(e) => setResume({ ...resume, skills: e.target.value.split(",").map(s => s.trim()) })}
                                        placeholder="Comma separated (e.g. React, Node.js, Python)"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="design" className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                            {Object.keys(TEMPLATES).map((theme) => (
                                <div
                                    key={theme}
                                    className={`cursor-pointer group relative rounded-lg overflow-hidden border-2 transition-all ${resume.theme === theme ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2" : "border-muted hover:border-blue-400"}`}
                                    onClick={() => setResume({ ...resume, theme })}
                                >
                                    <div className="aspect-[3/4] bg-muted relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-widest text-muted-foreground bg-white/50 backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity">
                                            {theme}
                                        </div>
                                        {/* In real app, we would render a scaled-down version of the template here, but for now just the name is fine or a static image */}
                                    </div>
                                    <div className="p-3 bg-card text-center font-medium capitalize border-t">
                                        {theme}
                                    </div>
                                    {resume.theme === theme && (
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                                            <div className="h-3 w-3 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-muted/30 p-8 overflow-y-auto flex justify-center">
                <div className="origin-top scale-[0.7] md:scale-90 transition-transform">
                    <div
                        ref={componentRef}
                        id="resume-preview"
                        className="bg-white shadow-2xl w-[210mm] min-h-[297mm] overflow-hidden"
                    >
                        {(() => {
                            const SelectedTemplate = TEMPLATES[resume.theme as keyof typeof TEMPLATES] || TemplateModern;
                            return <SelectedTemplate data={resume} />;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
