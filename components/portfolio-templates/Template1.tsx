import React from "react";
import { Button } from "@/components/ui/button";

export const PortfolioTemplate1 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-sans text-slate-900 bg-white">
            <header className="py-24 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">{hero.title}</h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto">{hero.subtitle}</p>
                {hero.ctaLink && (
                    <a href={hero.ctaLink} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="rounded-full px-8 text-lg py-6 shadow-lg hover:shadow-xl transition-all">
                            {hero.ctaText || "Get Started"}
                        </Button>
                    </a>
                )}
            </header>

            <section className="py-20 px-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">{about.title}</h2>
                <div className="prose prose-lg mx-auto text-slate-600">
                    <p className="whitespace-pre-wrap">{about.description}</p>
                </div>
            </section>

            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: any, i: number) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="h-48 bg-slate-200 relative">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                    <p className="text-slate-600 mb-4 line-clamp-3">{project.description}</p>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                                            View Project &rarr;
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 text-center bg-slate-900 text-white">
                <h2 className="text-3xl font-bold mb-6">Contact</h2>
                <p className="text-slate-300 mb-8 text-lg">Interested in working together?</p>
                <a href={`mailto:${contact.email}`} className="text-2xl font-bold border-b-2 border-blue-500 pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors">
                    {contact.email}
                </a>
            </section>
        </div>
    );
};
