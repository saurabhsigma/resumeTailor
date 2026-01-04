import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Globe, Trash2, Edit, ExternalLink } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { redirect } from "next/navigation";

async function getPortfolios(userId: string) {
    await connectToDatabase();
    const portfolios = await Portfolio.find({ userId }).sort({ updatedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(portfolios));
}

export default async function PortfoliosPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/login");
    }

    // @ts-ignore
    const portfolios = await getPortfolios(session.user.id);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">My Portfolios</h2>
                <Link href="/dashboard/portfolios/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Portfolio
                    </Button>
                </Link>
            </div>

            {portfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20">
                    <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No portfolios yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Launch your personal website today.</p>
                    <Link href="/dashboard/portfolios/new">
                        <Button variant="outline">Create Portfolio</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {portfolios.map((portfolio: any) => (
                        <Card key={portfolio._id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{portfolio.title || "Untitled Portfolio"}</CardTitle>
                                <p className="text-xs text-muted-foreground">Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-muted border rounded shadow-sm flex items-center justify-center text-muted-foreground text-xs overflow-hidden relative">
                                    <Globe className="h-8 w-8 opacity-20" />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-blue-500">
                                    <Globe className="h-3 w-3" />
                                    <span className="truncate">/p/{portfolio.subdomain || "..."}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Link href={`/dashboard/portfolios/${portfolio._id}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Link href={`/p/${portfolio.subdomain}`} target="_blank" className={!portfolio.subdomain ? "pointer-events-none opacity-50" : ""}>
                                    <Button variant="ghost" size="sm">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
