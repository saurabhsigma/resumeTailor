import React from "react";
import { Button } from "@/components/ui/button";

export const PortfolioTemplate1 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-sans text-slate-800 bg-white selection:bg-blue-100">
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                <div className="font-bold text-xl tracking-tight">{hero.title.split(' ')[0]}</div>
                <div className="flex gap-6 text-sm font-medium text-slate-500">
                    <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
                    <a href="#projects" className="hover:text-blue-600 transition-colors">Work</a>
                    <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
                </div>
            </nav>

            <header className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white relative overflow-hidden">
                <div className="absolute top-0 transform -translate-x-1/2 left-1/2 w-[1000px] h-[500px] bg-blue-100 rounded-[100%] blur-3xl opacity-20 pointer-events-none"></div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 relative z-10">
                    {hero.title}
                </h1>
                <p className="text-xl md:text-3xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed relative z-10">
                    {hero.subtitle}
                </p>
                {hero.ctaLink && (
                    <a href={hero.ctaLink} target="_blank" rel="noopener noreferrer" className="relative z-10">
                        <Button size="lg" className="rounded-full px-10 py-7 text-lg shadow-xl shadow-blue-500/20 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800">
                            {hero.ctaText || "See My Work"}
                        </Button>
                    </a>
                )}
            </header>

            <section id="about" className="py-24 px-6 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 md:w-1/4 shrink-0 pt-2">/ About</h2>
                    <div className="prose prose-lg text-slate-600 leading-loose">
                        <p className="whitespace-pre-wrap">{about.description}</p>
                    </div>
                </div>
            </section>

            <section id="projects" className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <h2 className="text-4xl font-bold tracking-tight">Selected Projects</h2>
                        <a href="#" className="hidden md:block text-slate-500 hover:text-slate-900 transition-colors">View All &rarr;</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projects.map((project: any, i: number) => (
                            <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
                                <div className="h-64 bg-slate-100 relative overflow-hidden">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300 font-medium bg-slate-50">No Preview</div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                    <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-sm uppercase tracking-wide text-slate-900 hover:text-blue-600 transition-colors">
                                            View Case Study <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="py-32 px-6 text-center bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start a project?</h2>
                    <p className="text-slate-500 mb-12 text-xl max-w-xl mx-auto">I'm currently available for freelance work and open to full-time opportunities.</p>
                    <a href={`mailto:${contact.email}`} className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-80 transition-opacity">
                        {contact.email}
                    </a>
                </div>
            </section>
        </div>
    );
};
