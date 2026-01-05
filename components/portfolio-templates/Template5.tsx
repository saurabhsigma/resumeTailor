import React from "react";
import { Button } from "@/components/ui/button";

export const PortfolioTemplate5 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-serif text-black bg-[#f0f0f0] min-h-screen">
            <nav className="fixed top-0 w-full p-6 flex justify-between mix-blend-difference text-white z-50">
                <span className="font-bold text-xl">{hero.title}</span>
                <a href={`mailto:${contact.email}`} className="uppercase text-sm tracking-wide">Contact</a>
            </nav>

            <header className="h-screen flex items-center justify-center p-6 relative">
                {hero.backgroundImage && (
                    <div className="absolute inset-0 z-0">
                        <img src={hero.backgroundImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                )}
                <div className="relative z-10 text-center text-white mix-blend-difference max-w-4xl">
                    <p className="text-lg md:text-2xl mb-4 italic font-light">{hero.subtitle}</p>
                    <h1 className="text-6xl md:text-9xl font-light tracking-tighter mb-8 leading-[0.8]">{hero.title}</h1>
                    {hero.ctaLink && (
                        <a href={hero.ctaLink} className="inline-block border border-white px-8 py-3 hover:bg-white hover:text-black transition-all uppercase text-sm tracking-widest">
                            {hero.ctaText || "View Works"}
                        </a>
                    )}
                </div>
            </header>

            <section className="py-32 px-6 md:px-20 bg-white">
                <div className="max-w-2xl">
                    <p className="text-2xl md:text-4xl leading-tight font-light">{about.description}</p>
                </div>
            </section>

            <section className="bg-[#f0f0f0] py-20 px-6">
                <div className="space-y-40">
                    {projects.map((project: any, i: number) => (
                        <div key={i} className={`flex flex-col md:flex-row gap-12 md:gap-24 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                            <div className="w-full md:w-1/2">
                                <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                                    {project.imageUrl && <img src={project.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />}
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <span className="text-xs font-sans uppercase tracking-widest text-gray-500 mb-4 block">Project {String(i + 1).padStart(2, '0')}</span>
                                <h2 className="text-4xl md:text-5xl font-light mb-6">{project.title}</h2>
                                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0 font-sans">{project.description}</p>
                                {project.link && (
                                    <a href={project.link} className="text-sm font-sans uppercase tracking-widest border-b border-black pb-1 hover:pb-2 transition-all">
                                        View Case Study
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="bg-black text-white py-32 px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-light mb-12">Let's create something together</h2>
                <a href={`mailto:${contact.email}`} className="text-xl md:text-2xl border-b border-gray-700 pb-2 hover:border-white transition-colors">
                    {contact.email}
                </a>
            </footer>
        </div>
    );
};
