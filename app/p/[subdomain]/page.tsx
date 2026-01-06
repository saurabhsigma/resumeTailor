import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { notFound } from "next/navigation";
import { PortfolioTemplate1 } from "@/components/portfolio-templates/Template1";
import { PortfolioTemplate2 } from "@/components/portfolio-templates/Template2";
import { PortfolioTemplate3 } from "@/components/portfolio-templates/Template3";
import { PortfolioTemplate4 } from "@/components/portfolio-templates/Template4";
import { PortfolioTemplate5 } from "@/components/portfolio-templates/Template5";
import { PortfolioTemplate6 } from "@/components/portfolio-templates/Template6";

const TEMPLATES = {
    template1: PortfolioTemplate1,
    template2: PortfolioTemplate2,
    template3: PortfolioTemplate3,
    template4: PortfolioTemplate4,
    template5: PortfolioTemplate5,
    template6: PortfolioTemplate6,
};

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

    const SelectedTemplate = TEMPLATES[portfolio.templateId as keyof typeof TEMPLATES] || PortfolioTemplate1;

    return <SelectedTemplate data={portfolio} />;
}
