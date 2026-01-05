import React from "react";
import { Button } from "@/components/ui/button";

export const PortfolioTemplate4 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-sans text-cyan-50 bg-slate-900 min-h-screen selection:bg-cyan-500 selection:text-white">
            <div className="max-w-7xl mx-auto px-6 border-x border-slate-800 min-h-screen relative">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />

                <header className="py-32 relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter">
                        {hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl border-l-4 border-cyan-500 pl-6">
                        {hero.subtitle}
                    </p>
                    {hero.ctaLink && (
                        <a href={hero.ctaLink} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest text-sm group">
                            {hero.ctaText || "Explore Work"}
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </a>
                    )}
                </header>

                <section className="mb-32 grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">About</h2>
                    </div>
                    <div className="md:col-span-8">
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed indent-12 whitespace-pre-wrap">
                            {about.description}
                        </p>
                    </div>
                </section>

                <section className="mb-32">
                    <div className="md:flex justify-between items-end mb-16 border-b border-slate-800 pb-4">
                        <h2 className="text-4xl font-bold">Resent Works</h2>
                        <span className="text-slate-500 font-mono">01 — {String(projects.length).padStart(2, '0')}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects.map((project: any, i: number) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/3] bg-slate-800 mb-6 overflow-hidden relative rounded-sm">
                                    {project.imageUrl && (
                                        <img src={project.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                    )}
                                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                                <p className="text-slate-400 mb-4">{project.description}</p>
                                {project.link && (
                                    <a href={project.link} className="text-xs font-mono text-cyan-500 hover:underline">
                                        ACCESS_PROJECT &nearr;
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="py-20 border-t border-slate-800 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 hover:text-cyan-400 transition-colors cursor-pointer block">
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </h2>
                    <div className="flex justify-center gap-8 text-slate-500 text-sm font-bold uppercase tracking-widest">
                        <span>Twitter</span>
                        <span>LinkedIn</span>
                        <span>GitHub</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};
