import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Trash2, Edit } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Resume } from "@/models/Resume";
import { redirect } from "next/navigation";

async function getResumes(userId: string) {
    await connectToDatabase();
    // Serialize to plain JSON
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(resumes));
}

export default async function ResumesPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/login");
    }

    // @ts-ignore
    const resumes = await getResumes(session.user.id);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">My Resumes</h2>
                <Link href="/dashboard/resumes/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Resume
                    </Button>
                </Link>
            </div>

            {resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No resumes yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create your first resume to get started.</p>
                    <Link href="/dashboard/resumes/new">
                        <Button variant="outline">Create Resume</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume: any) => (
                        <Card key={resume._id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{resume.title || "Untitled Resume"}</CardTitle>
                                <p className="text-xs text-muted-foreground">Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-[210/297] bg-white border rounded shadow-sm flex items-center justify-center text-muted-foreground text-xs overflow-hidden relative">
                                    {/* Thumbnail placeholder - could be iframe or image in future */}
                                    <div className="absolute inset-0 bg-muted/10 p-2 opacity-50 pointer-events-none select-none">
                                        <div className="w-full h-4 bg-black/10 mb-2 rounded"></div>
                                        <div className="w-2/3 h-4 bg-black/10 mb-6 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="w-full h-2 bg-black/5 rounded"></div>
                                            <div className="w-full h-2 bg-black/5 rounded"></div>
                                            <div className="w-full h-2 bg-black/5 rounded"></div>
                                        </div>
                                    </div>
                                    <span>Preview</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Link href={`/dashboard/resumes/${resume._id}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
