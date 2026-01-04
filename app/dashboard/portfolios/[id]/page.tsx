import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { redirect } from "next/navigation";
import PortfolioEditor from "@/components/portfolio-editor";

async function getPortfolio(id: string, userId: string) {
    await connectToDatabase();
    const portfolio = await Portfolio.findOne({ _id: id, userId }).lean();
    return portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;
}

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/login");
    }

    const { id } = await params;
    const portfolio = await getPortfolio(id, session.user.id as string);

    if (!portfolio) {
        redirect("/dashboard/portfolios");
    }

    return (
        <div className="h-full">
            <PortfolioEditor initialData={portfolio} />
        </div>
    );
}
