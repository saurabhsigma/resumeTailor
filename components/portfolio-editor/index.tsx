// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PortfolioTemplate1 } from "@/components/portfolio-templates/Template1";
import { PortfolioTemplate2 } from "@/components/portfolio-templates/Template2";
import { PortfolioTemplate3 } from "@/components/portfolio-templates/Template3";
import { PortfolioTemplate4 } from "@/components/portfolio-templates/Template4";
import { PortfolioTemplate5 } from "@/components/portfolio-templates/Template5";
import { PortfolioTemplate6 } from "@/components/portfolio-templates/Template6";

const TEMPLATES = {
    template1: PortfolioTemplate1,
    template2: PortfolioTemplate2,
    template3: PortfolioTemplate3,
    template4: PortfolioTemplate4,
    template5: PortfolioTemplate5,
    template6: PortfolioTemplate6,
};

export default function PortfolioEditor({ initialData }: { initialData: any }) {
    const [portfolio, setPortfolio] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleChange = (section: string, field: string, value: string) => {
        setPortfolio((prev: any) => ({
            ...prev,
            content: {
                ...prev.content,
                [section]: {
                    ...prev.content[section],
                    [field]: value
                }
            }
        }));
    };

    const handleProjectChange = (index: number, field: string, value: string) => {
        setPortfolio((prev: any) => {
            const newProjects = [...prev.content.projects];
            newProjects[index] = { ...newProjects[index], [field]: value };
            return {
                ...prev,
                content: { ...prev.content, projects: newProjects }
            };
        });
    };

    const addProject = () => {
        setPortfolio((prev: any) => ({
            ...prev,
            content: {
                ...prev.content,
                projects: [...prev.content.projects, { title: "New Project", description: "", imageUrl: "", link: "" }]
            }
        }));
    };

    const removeProject = (index: number) => {
        setPortfolio((prev: any) => {
            const newProjects = [...prev.content.projects];
            newProjects.splice(index, 1);
            return {
                ...prev,
                content: { ...prev.content, projects: newProjects }
            };
        });
    };

    const savePortfolio = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/portfolios/${portfolio._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(portfolio)
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Error saving");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Panel - Editor */}
            <div className="w-1/3 border-r flex flex-col bg-muted/10">
                <div className="p-4 border-b bg-background flex justify-between items-center">
                    <Link href="/dashboard/portfolios">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={savePortfolio} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Link href={`/p/${portfolio.subdomain}`} target="_blank">
                            <Button size="sm" variant="ghost">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Live
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 pt-4 bg-background border-b">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="design">Design</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="content" className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <Label>Portfolio Title</Label>
                                <Input value={portfolio.title || ""} onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subdomain (yoursite.com/p/<b>{portfolio.subdomain}</b>)</Label>
                                <Input value={portfolio.subdomain || ""} onChange={(e) => setPortfolio({ ...portfolio, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
                            </div>
                        </div>

                        <Tabs defaultValue="hero" className="mt-2">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="hero">Hero</TabsTrigger>
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                                <TabsTrigger value="contact">Contact</TabsTrigger>
                            </TabsList>

                            <TabsContent value="hero" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Main Title (Headline)</Label>
                                    <Input value={portfolio.content.hero.title || ""} onChange={(e) => handleChange("hero", "title", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input value={portfolio.content.hero.subtitle || ""} onChange={(e) => handleChange("hero", "subtitle", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>CTA Text</Label>
                                    <Input value={portfolio.content.hero.ctaText || ""} onChange={(e) => handleChange("hero", "ctaText", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>CTA Link</Label>
                                    <Input value={portfolio.content.hero.ctaLink || ""} onChange={(e) => handleChange("hero", "ctaLink", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hero Background Image</Label>
                                    <ImageUpload
                                        value={portfolio.content.hero.backgroundImage}
                                        onChange={(url) => handleChange("hero", "backgroundImage", url)}
                                        onRemove={() => handleChange("hero", "backgroundImage", "")}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="about" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Heading</Label>
                                    <Input value={portfolio.content.about.title || ""} onChange={(e) => handleChange("about", "title", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={portfolio.content.about.description || ""} onChange={(e) => handleChange("about", "description", e.target.value)} className="h-40" />
                                </div>
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-4 mt-4">
                                <Button className="w-full" variant="secondary" onClick={addProject}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Project
                                </Button>
                                {portfolio.content.projects.map((project: any, index: number) => (
                                    <Card key={index} className="relative">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeProject(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="space-y-2">
                                                <Label>Project Title</Label>
                                                <Input value={project.title || ""} onChange={(e) => handleProjectChange(index, "title", e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea value={project.description || ""} onChange={(e) => handleProjectChange(index, "description", e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Link (URL)</Label>
                                                <Input value={project.link || ""} onChange={(e) => handleProjectChange(index, "link", e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Project Image</Label>
                                                <ImageUpload
                                                    value={project.imageUrl}
                                                    onChange={(url) => handleProjectChange(index, "imageUrl", url)}
                                                    onRemove={() => handleProjectChange(index, "imageUrl", "")}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="contact" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Contact Email</Label>
                                    <Input value={portfolio.content.contact.email || ""} onChange={(e) => handleChange("contact", "email", e.target.value)} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="design" className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Choose Template</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(TEMPLATES).map((templateKey) => (
                                        <div
                                            key={templateKey}
                                            onClick={() => setPortfolio({ ...portfolio, theme: templateKey })}
                                            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:border-primary ${
                                                portfolio.theme === templateKey ? "border-primary ring-2 ring-primary/20" : "border-muted"
                                            }`}
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative">
                                                {(templateKey === "template1" || templateKey === "template2") ? (
                                                    <div className="w-full h-full flex items-start justify-center overflow-hidden">
                                                        <div className="w-[1920px] h-[1080px] origin-top scale-[0.08] pointer-events-none select-none">
                                                            {templateKey === "template1" && <PortfolioTemplate1 data={portfolio} />}
                                                            {templateKey === "template2" && <PortfolioTemplate2 data={portfolio} />}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                        {templateKey.replace("template", "Template ")}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2 bg-background text-center text-xs font-medium">
                                                {templateKey.replace("template", "Template ").toUpperCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="w-2/3 bg-white overflow-y-auto">
                {(() => {
                    const SelectedTemplate = TEMPLATES[portfolio.theme as keyof typeof TEMPLATES] || PortfolioTemplate1;
                    return <SelectedTemplate data={portfolio} />;
                })()}
            </div>
        </div>
    );
}
