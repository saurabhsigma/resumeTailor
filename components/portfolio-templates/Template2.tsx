import React from "react";
import { Button } from "@/components/ui/button";

export const PortfolioTemplate2 = ({ data }: { data: any }) => {
    const { hero, about, projects, contact } = data.content;

    return (
        <div className="font-serif text-amber-950 bg-amber-50 min-h-screen">
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left (Hero) */}
                <div
                    className="lg:w-1/2 p-12 flex flex-col justify-center bg-amber-900 text-amber-50 relative overflow-hidden"
                    style={{
                        backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className={`z-10 relative ${hero.backgroundImage ? "bg-amber-900/80 p-8 rounded-xl backdrop-blur-sm" : ""}`}>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">{hero.title}</h1>
                        <p className="text-xl lg:text-2xl opacity-90 mb-10 font-sans">{hero.subtitle}</p>
                        {hero.ctaLink && (
                            <a href={hero.ctaLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="lg" className="rounded-none px-8 text-lg">
                                    {hero.ctaText || "View Work"}
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                {/* Right (Content) */}
                <div className="lg:w-1/2 overflow-y-auto h-screen bg-amber-50">
                    <div className="p-12 lg:p-20 space-y-20">
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-900/50 mb-6 font-sans">{about.title}</h2>
                            <p className="text-lg leading-relaxed whitespace-pre-wrap">{about.description}</p>
                        </section>

                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-900/50 mb-8 font-sans">Selected Work</h2>
                            <div className="space-y-12">
                                {projects.map((project: any, i: number) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="aspect-video bg-amber-200 mb-4 overflow-hidden">
                                            {project.imageUrl ? (
                                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-amber-800/30">IMAGE</div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-700 transition-colors">{project.title}</h3>
                                        <p className="text-amber-900/70 mb-3">{project.description}</p>
                                        {project.link && <a href={project.link} className="text-sm font-bold uppercase tracking-wide border-b border-amber-900 font-sans">View</a>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white p-10 border border-amber-900/10">
                            <h2 className="text-2xl font-bold mb-4">Let's Talk</h2>
                            <p className="mb-6 opacity-70">Reach me at:</p>
                            <a href={`mailto:${contact.email}`} className="text-xl font-bold hover:underline">
                                {contact.email}
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
