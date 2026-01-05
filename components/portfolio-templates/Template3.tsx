import React from "react";
import { Button } from "@/components/ui/button";

export const PortfolioTemplate3 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-mono text-lime-900 bg-[#f4f4f0] min-h-screen border-t-8 border-lime-600">
            <div className="max-w-5xl mx-auto p-4 md:p-12 border-l border-r border-dotted border-lime-300 min-h-screen theme-grid">
                <header className="mb-20 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-lime-200 px-2 py-1 text-xs font-bold mb-4 uppercase tracking-widest text-lime-800">Portfolio_v3.0</div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">{hero.title}</h1>
                        <p className="text-lg text-lime-800/80 mb-8 border-l-4 border-lime-400 pl-4">{hero.subtitle}</p>
                        {hero.ctaLink && (
                            <a href={hero.ctaLink} className="inline-block bg-lime-900 text-lime-50 px-6 py-3 font-bold hover:bg-lime-800 transition-colors">
                                {`> ${hero.ctaText || "Execute"}`}
                            </a>
                        )}
                    </div>
                    {hero.backgroundImage && (
                        <div className="md:h-64 h-48 bg-lime-200 border-2 border-lime-900 shadow-[8px_8px_0px_0px_rgba(54,83,20,1)] rounded-sm overflow-hidden">
                            <img src={hero.backgroundImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                        </div>
                    )}
                </header>

                <hr className="border-lime-300 border-dashed mb-16" />

                <section className="mb-20">
                    <div className="bg-white border-2 border-lime-900 p-8 shadow-[4px_4px_0px_0px_rgba(54,83,20,0.2)]">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 bg-lime-500 rounded-full"></span>
                            {about.title}
                        </h2>
                        <p className="text-lime-900/80 leading-relaxed whitespace-pre-wrap">{about.description}</p>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 decoration-wavy underline decoration-lime-400">./projects</h2>
                    <div className="space-y-4">
                        {projects.map((project: any, i: number) => (
                            <div key={i} className="bg-white border border-lime-300 p-6 flex flex-col md:flex-row gap-6 hover:border-lime-500 transition-colors">
                                {project.imageUrl && (
                                    <div className="w-full md:w-32 h-24 bg-lime-100 flex-shrink-0 border border-lime-200">
                                        <img src={project.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold">{project.title}</h3>
                                        <span className="text-xs bg-lime-100 px-2 py-1 rounded text-lime-700">INDEX_{String(i + 1).padStart(2, '0')}</span>
                                    </div>
                                    <p className="text-sm text-lime-800/70 mb-4">{project.description}</p>
                                    {project.link && (
                                        <a href={project.link} className="text-xs font-bold uppercase hover:bg-lime-900 hover:text-white px-2 py-1 transition-colors">
                                            [ Open_Link ]
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="text-center pt-12 border-t border-lime-300 border-dotted text-sm text-lime-700">
                    <p className="mb-4">End of Line.</p>
                    <a href={`mailto:${contact.email}`} className="font-bold bg-lime-200 px-4 py-2 hover:bg-lime-300 transition-colors">
                        {contact.email}
                    </a>
                </footer>
            </div>
        </div>
    );
};
