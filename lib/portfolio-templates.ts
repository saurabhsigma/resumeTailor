export interface PortfolioTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    theme: string;
    colorMode: string;
    customColors: {
        background: string;
        text: string;
        accent: string;
    };
    sampleProjects: Array<{
        title: string;
        description: string;
        scope: string;
        technologies: string[];
        status: string;
        isFeatured: boolean;
    }>;
    sampleBio: string;
    sampleSkills: string[];
}

export const portfolioTemplates: PortfolioTemplate[] = [
    {
        id: "minimalist-dev",
        name: "Minimalist Developer",
        description: "Clean, professional template for software developers. Focus on code and projects.",
        category: "Developer",
        thumbnail: "/templates/minimalist-dev.jpg",
        theme: "modern",
        colorMode: "dark",
        customColors: {
            background: "#080808",
            text: "#ffffff",
            accent: "#5e6ad2"
        },
        sampleBio: "Full-stack developer specializing in building exceptional digital experiences. Currently focused on React, Node.js, and cloud architecture.",
        sampleSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"],
        sampleProjects: [
            {
                title: "E-Commerce Platform",
                description: "A full-featured online shopping platform with real-time inventory management",
                scope: "Built a scalable e-commerce solution handling 10k+ daily users with advanced search, cart management, and payment integration.",
                technologies: ["Next.js", "Stripe", "MongoDB", "Tailwind CSS"],
                status: "completed",
                isFeatured: true
            },
            {
                title: "Task Management App",
                description: "Collaborative project management tool for remote teams",
                scope: "Developed a real-time collaboration platform with drag-and-drop boards, team chat, and file sharing.",
                technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
                status: "completed",
                isFeatured: true
            }
        ]
    },
    {
        id: "creative-designer",
        name: "Creative Designer",
        description: "Bold, colorful template perfect for designers and creative professionals.",
        category: "Designer",
        thumbnail: "/templates/creative-designer.jpg",
        theme: "creative",
        colorMode: "light",
        customColors: {
            background: "#ffffff",
            text: "#0f172a",
            accent: "#ec4899"
        },
        sampleBio: "Visual designer & brand strategist crafting memorable experiences through thoughtful design and strategic thinking.",
        sampleSkills: ["UI/UX Design", "Branding", "Figma", "Adobe Suite", "Prototyping", "Design Systems"],
        sampleProjects: [
            {
                title: "Brand Identity for TechCo",
                description: "Complete brand redesign for a SaaS startup",
                scope: "Developed comprehensive brand identity including logo, color system, typography, and brand guidelines for a B2B SaaS company.",
                technologies: ["Figma", "Illustrator", "Brand Strategy"],
                status: "completed",
                isFeatured: true
            },
            {
                title: "Mobile App Design",
                description: "Fitness tracking app with gamification",
                scope: "Designed intuitive mobile experience with gesture-based navigation, custom illustrations, and engaging micro-interactions.",
                technologies: ["Figma", "Prototyping", "User Research"],
                status: "completed",
                isFeatured: true
            }
        ]
    },
    {
        id: "premium-freelancer",
        name: "Premium Freelancer",
        description: "High-end portfolio with glassmorphism effects. Perfect for established freelancers.",
        category: "Freelancer",
        thumbnail: "/templates/premium-freelancer.jpg",
        theme: "premium",
        colorMode: "dark",
        customColors: {
            background: "#000000",
            text: "#ffffff",
            accent: "#8b5cf6"
        },
        sampleBio: "Senior product designer & creative director. 8+ years crafting digital products for Fortune 500 companies and startups.",
        sampleSkills: ["Product Design", "Creative Direction", "Design Systems", "User Research", "Motion Design", "Strategy"],
        sampleProjects: [
            {
                title: "Enterprise Dashboard",
                description: "Data visualization platform for financial services",
                scope: "Led design of comprehensive analytics dashboard serving 50k+ enterprise users with complex data visualization and real-time updates.",
                technologies: ["Figma", "React", "D3.js", "Design System"],
                status: "completed",
                isFeatured: true
            },
            {
                title: "Design System Creation",
                description: "Scalable design system for multi-platform apps",
                scope: "Built complete design system from scratch including component library, documentation, and governance guidelines.",
                technologies: ["Figma", "Storybook", "Documentation"],
                status: "completed",
                isFeatured: true
            }
        ]
    },
    {
        id: "zen-writer",
        name: "Zen Writer",
        description: "Editorial-style template for writers, journalists, and content creators.",
        category: "Writer",
        thumbnail: "/templates/zen-writer.jpg",
        theme: "zen",
        colorMode: "light",
        customColors: {
            background: "#fafaf9",
            text: "#1c1917",
            accent: "#78716c"
        },
        sampleBio: "Content strategist and writer helping brands tell compelling stories. Published in TechCrunch, The Verge, and Wired.",
        sampleSkills: ["Content Strategy", "Technical Writing", "SEO", "Copywriting", "Editing", "Research"],
        sampleProjects: [
            {
                title: "Content Strategy Overhaul",
                description: "Complete content restructure for B2B SaaS",
                scope: "Developed comprehensive content strategy increasing organic traffic by 300% through SEO-optimized blog posts, guides, and case studies.",
                technologies: ["SEO", "Content Strategy", "Analytics"],
                status: "completed",
                isFeatured: true
            },
            {
                title: "Technical Documentation",
                description: "Developer documentation for API platform",
                scope: "Created developer-first documentation with interactive examples, API references, and getting-started guides for complex API platform.",
                technologies: ["Technical Writing", "API Documentation", "Markdown"],
                status: "completed",
                isFeatured: true
            }
        ]
    },
    {
        id: "developer-terminal",
        name: "Developer Terminal",
        description: "Terminal-inspired dark theme for developers who love the command line aesthetic.",
        category: "Developer",
        thumbnail: "/templates/developer-terminal.jpg",
        theme: "dev",
        colorMode: "dark",
        customColors: {
            background: "#0a0e27",
            text: "#00ff41",
            accent: "#00ff41"
        },
        sampleBio: "Backend engineer & DevOps specialist. Building robust systems that scale. Open source contributor.",
        sampleSkills: ["Python", "Go", "Kubernetes", "AWS", "CI/CD", "System Design"],
        sampleProjects: [
            {
                title: "Microservices Architecture",
                description: "Distributed system for high-traffic platform",
                scope: "Architected and implemented microservices infrastructure handling 1M+ requests/day with auto-scaling, monitoring, and fault tolerance.",
                technologies: ["Go", "Kubernetes", "PostgreSQL", "Redis"],
                status: "completed",
                isFeatured: true
            },
            {
                title: "CI/CD Pipeline",
                description: "Automated deployment pipeline",
                scope: "Built comprehensive CI/CD system reducing deployment time by 80% with automated testing, security scans, and zero-downtime deployments.",
                technologies: ["GitHub Actions", "Docker", "Terraform", "AWS"],
                status: "completed",
                isFeatured: true
            }
        ]
    },
    {
        id: "simple-starter",
        name: "Simple Starter",
        description: "Perfect starting point with minimal setup. Easy to customize.",
        category: "General",
        thumbnail: "/templates/simple-starter.jpg",
        theme: "modern",
        colorMode: "light",
        customColors: {
            background: "#ffffff",
            text: "#0f172a",
            accent: "#2563eb"
        },
        sampleBio: "Professional focused on delivering quality work and building lasting client relationships.",
        sampleSkills: ["Project Management", "Communication", "Problem Solving", "Time Management"],
        sampleProjects: [
            {
                title: "Sample Project",
                description: "Replace this with your actual project",
                scope: "Describe what you built, the problems you solved, and the impact it had. Include metrics if possible.",
                technologies: ["Add", "Your", "Tech", "Stack"],
                status: "completed",
                isFeatured: true
            }
        ]
    }
];

export function getTemplateById(id: string): PortfolioTemplate | undefined {
    return portfolioTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): PortfolioTemplate[] {
    return portfolioTemplates.filter(t => t.category === category);
}

export const templateCategories = [
    "All",
    "Developer",
    "Designer",
    "Freelancer",
    "Writer",
    "General"
];
