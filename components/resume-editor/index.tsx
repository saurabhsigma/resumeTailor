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
import Link from "next/link";
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

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
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
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-muted/30 p-8 overflow-y-auto flex justify-center">
                <div
                    ref={componentRef}
                    id="resume-preview"
                    className="bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] space-y-4 text-sm"
                    style={{ fontSize: "1rem", lineHeight: "1.5" }} // Base styles to prevent tailwind resets from making it look weird
                >
                    {/* Header */}
                    <div className="text-center border-b pb-4 mb-4">
                        <h1 className="text-3xl font-bold uppercase mb-2">{resume.personalInfo.fullName}</h1>
                        <div className="flex justify-center gap-4 text-xs text-gray-600 flex-wrap">
                            {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                            {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
                            {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
                            {resume.personalInfo.linkedin && <span>| {resume.personalInfo.linkedin}</span>}
                            {resume.personalInfo.website && <span>| {resume.personalInfo.website}</span>}
                        </div>
                    </div>

                    {/* Summary */}
                    {resume.summary && (
                        <div className="mb-4">
                            <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Professional Summary</h2>
                            <p className="text-sm text-justify">{resume.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {resume.experience.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Experience</h2>
                            <div className="space-y-3">
                                {resume.experience.map((exp: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-semibold">
                                            <span>{exp.role}</span>
                                            <span className="text-xs">{exp.startDate} - {exp.endDate || "Present"}</span>
                                        </div>
                                        <div className="text-xs font-semibold">{exp.company}</div>
                                        <p className="text-sm mt-1 whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {resume.education.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Education</h2>
                            <div className="space-y-3">
                                {resume.education.map((edu: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-semibold">
                                            <span>{edu.school}</span>
                                            <span className="text-xs">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <div className="text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {resume.skills.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-sm font-bold uppercase border-b border-black mb-2 tracking-wider">Skills</h2>
                            <div className="flex flex-wrap gap-1">
                                {resume.skills.map((skill: string, i: number) => (
                                    <span key={i} className="text-sm">{skill}{i < resume.skills.length - 1 ? " • " : ""}</span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
