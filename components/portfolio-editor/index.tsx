// @ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PortfolioEditor({ initialData }: { initialData: any }) {
    const [portfolio, setPortfolio] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);

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

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Portfolio Title</Label>
                            <Input value={portfolio.title || ""} onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subdomain (yoursite.com/p/<b>{portfolio.subdomain}</b>)</Label>
                            <Input value={portfolio.subdomain || ""} onChange={(e) => setPortfolio({ ...portfolio, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
                            <p className="text-xs text-muted-foreground">Only lowercase letters and hyphens.</p>
                        </div>
                    </div>

                    <Tabs defaultValue="hero" className="mt-6">
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
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Contact Email</Label>
                                <Input value={portfolio.content.contact.email || ""} onChange={(e) => handleChange("contact", "email", e.target.value)} />
                            </div>
                            {/* Can add socials here later */}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="w-2/3 bg-background overflow-y-auto">
                {/* This is a simplified preview - in real app it would be an iframe or a complex renderer */}
                <div className="min-h-full border-l">
                    {/* Render the portfolio content directly here for WYSIWYG feel */}

                    {/* Hero Section */}
                    <section className="py-20 px-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4">{portfolio.content.hero.title}</h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{portfolio.content.hero.subtitle}</p>
                        {portfolio.content.hero.ctaText && (
                            <Button size="lg" className="rounded-full px-8">
                                {portfolio.content.hero.ctaText}
                            </Button>
                        )}
                    </section>

                    {/* About Section */}
                    <section className="py-16 px-8 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">{portfolio.content.about.title}</h2>
                        <div className="prose dark:prose-invert">
                            <p className="whitespace-pre-wrap text-lg leading-relaxed">{portfolio.content.about.description}</p>
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section className="py-16 px-8 bg-muted/20">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold mb-10 text-center">Featured Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {portfolio.content.projects.map((project: any, i: number) => (
                                    <div key={i} className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground">
                                            {project.imageUrl ? <img src={project.imageUrl} className="w-full h-full object-cover" /> : <span className="text-sm">No Image</span>}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
                                            {project.link && (
                                                <a href={project.link} target="_blank" className="text-primary text-sm hover:underline">View Project &rarr;</a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="py-20 px-8 text-center" id="contact">
                        <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                        <p className="text-lg text-muted-foreground mb-8">Interested in working together?</p>
                        <a href={`mailto:${portfolio.content.contact.email}`}>
                            <Button size="lg" variant="outline">
                                {portfolio.content.contact.email}
                            </Button>
                        </a>
                    </section>

                    <footer className="py-8 text-center text-sm text-muted-foreground border-t">
                        © {new Date().getFullYear()} {portfolio.content.hero.title}. All rights reserved.
                    </footer>

                </div>
            </div>
        </div>
    );
}
