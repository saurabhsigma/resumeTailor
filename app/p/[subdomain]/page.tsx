import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

async function getPortfolioBySubdomain(subdomain: string) {
    await connectToDatabase();
    const portfolio = await Portfolio.findOne({ subdomain }).lean();
    return portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ subdomain: string }> }) {
    const { subdomain } = await params;
    const portfolio = await getPortfolioBySubdomain(subdomain);

    if (!portfolio) {
        notFound();
    }

    const { content } = portfolio;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-background/80 backdrop-blur border-b z-50 px-6 h-16 flex items-center justify-between">
                <div className="font-bold text-lg">{content.hero.title}</div>
                <div className="hidden md:flex gap-6 text-sm">
                    <a href="#about" className="hover:text-primary transition-colors">About</a>
                    <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
                    <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
                </div>
                {content.hero.ctaLink && (
                    <a href={content.hero.ctaLink}>
                        <Button size="sm">{content.hero.ctaText || "Contact Me"}</Button>
                    </a>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-8 text-center bg-gradient-to-b from-background to-muted/30">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 pb-2">
                        {content.hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        {content.hero.subtitle}
                    </p>
                    {content.hero.ctaLink && (
                        <div className="pt-8">
                            <a href={content.hero.ctaLink}>
                                <Button size="lg" className="rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all">
                                    {content.hero.ctaText || "Get In Touch"}
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-8 max-w-4xl mx-auto">
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">{content.about.title}</h2>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">{content.about.description}</p>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 px-8 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Selected Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {content.projects.map((project: any, i: number) => (
                            <div key={i} className="group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="h-52 bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                                    {project.imageUrl ?
                                        <img src={project.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        : <span className="text-sm">No Preview Image</span>
                                    }
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="font-bold text-2xl group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{project.description}</p>
                                    {project.link && (
                                        <div className="pt-2">
                                            <a href={project.link} target="_blank" className="inline-flex items-center text-primary text-sm font-medium hover:underline">
                                                View Project
                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 px-8 text-center bg-background">
                <div className="max-w-xl mx-auto space-y-8">
                    <h2 className="text-4xl font-bold">Let's Work Together</h2>
                    <p className="text-xl text-muted-foreground">
                        Have a project in mind? I'd love to hear from you.
                    </p>
                    <a href={`mailto:${content.contact.email}`}>
                        <Button size="lg" className="h-14 px-10 text-lg">
                            Email Me: {content.content?.email || content.contact.email}
                        </Button>
                    </a>
                </div>
            </section>

            <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-muted/10">
                <p>© {new Date().getFullYear()} {content.hero.title}.</p>
                <div className="mt-2 text-xs opacity-50">
                    Powered by <a href="/" className="hover:underline">ResumeTailor</a>
                </div>
            </footer>
        </div>
    );
}
