import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Globe, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar Placeholder */}
      <header className="px-6 h-16 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          <span className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-transparent bg-clip-text">ResumeTailor</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="premium">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-background to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 -z-10" />
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-500 uppercase bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
              AI-Powered Career Growth
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              Build Your Future. <br className="hidden md:block" />
              <span className="text-indigo-600 dark:text-indigo-400">Tailored to Perfection.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Create professional resumes, stunning portfolio websites, and tailor your applications with AI precision. All in one implementation-ready platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="premium" className="h-12 px-8 text-lg">
                  Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Everything you need to land the job</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <CardTitle>Live Resume Maker</CardTitle>
                  <CardDescription>
                    Create ATS-friendly resumes with our real-time editor and professional templates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                    <li>Real-time Preview</li>
                    <li>drag-and-drop sections</li>
                    <li>PDF Export</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <CardTitle>Portfolio Builder</CardTitle>
                  <CardDescription>
                    Launch a personal portfolio website in minutes with custom subdomains.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                    <li>Premium Templates</li>
                    <li>Custom Domain Support</li>
                    <li>Instant Publishing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-card border-indigo-100 dark:border-indigo-900/50 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <CardTitle>Smart AI Tailor</CardTitle>
                  <CardDescription>
                    Automatically customize your resume for every job application using advanced AI.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                    <li>Keyword Optimization</li>
                    <li>Summary Generator</li>
                    <li>Job Match Analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResumeTailor. All rights reserved.
      </footer>
    </div>
  );
}
