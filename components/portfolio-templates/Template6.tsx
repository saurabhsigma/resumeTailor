import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const PortfolioTemplate6 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-sans text-slate-800 bg-slate-50 min-h-screen md:flex">
            {/* Sidebar / Navigation */}
            <aside className="md:w-80 bg-white border-r h-screen sticky top-0 md:flex flex-col justify-between hidden p-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">{hero.title}</h1>
                    <p className="text-sm text-slate-500">{hero.subtitle}</p>
                </div>

                <nav className="space-y-4">
                    <a href="#about" className="block text-slate-600 hover:text-blue-600 font-medium">About</a>
                    <a href="#projects" className="block text-slate-600 hover:text-blue-600 font-medium">Projects</a>
                    <a href="#contact" className="block text-slate-600 hover:text-blue-600 font-medium">Contact</a>
                </nav>

                <div className="flex gap-4 text-slate-400">
                    <Github size={20} className="hover:text-slate-900 cursor-pointer" />
                    <Linkedin size={20} className="hover:text-slate-900 cursor-pointer" />
                    <Twitter size={20} className="hover:text-slate-900 cursor-pointer" />
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-white p-6 border-b sticky top-0 z-50 flex justify-between items-center">
                <h1 className="font-bold">{hero.title}</h1>
                <Button size="sm" variant="outline">Menu</Button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-16 max-w-5xl mx-auto space-y-32">
                <section id="about" className="pt-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">Introduction</h2>
                    <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                        {about.title || `Hi, I'm ${hero.title}. I build things for the web.`}
                    </h3>
                    <div className="prose prose-lg text-slate-600 max-w-3xl">
                        <p>{about.description}</p>
                    </div>
                </section>

                <section id="projects">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-10">Selected Projects</h2>
                    <div className="grid gap-12">
                        {projects.map((project: any, i: number) => (
                            <div key={i} className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all">
                                <div className="md:flex gap-8 items-start">
                                    <div className="md:w-1/3 mb-4 md:mb-0">
                                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                            {project.imageUrl && <img src={project.imageUrl} className="w-full h-full object-cover" />}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                        <p className="text-slate-600 mb-6 leading-relaxed">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {/* Tags Mockup */}
                                            {['React', 'Next.js', 'Typescript'].map(tag => (
                                                <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{tag}</span>
                                            ))}
                                        </div>
                                        {project.link && (
                                            <a href={project.link} className="inline-flex items-center text-sm font-bold text-blue-600 hover:underline">
                                                View Live <span className="ml-1">&nearr;</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="contact" className="pb-20">
                    <div className="bg-blue-600 text-white p-12 rounded-3xl text-center">
                        <h2 className="text-3xl font-bold mb-4">Interested in collaboration?</h2>
                        <p className="text-blue-100 mb-8 text-lg">I'm currently available for freelance work.</p>
                        <a href={`mailto:${contact.email}`}>
                            <Button size="lg" variant="secondary" className="font-bold text-blue-600">
                                <Mail className="mr-2 h-4 w-4" /> Say Hello
                            </Button>
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
};
