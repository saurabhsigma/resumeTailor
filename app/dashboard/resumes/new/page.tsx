"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CreateResumePage() {
    const router = useRouter();
    const hasCreated = useRef(false);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [limitInfo, setLimitInfo] = useState<{ current: number; limit: number; plan: string } | null>(null);

    useEffect(() => {
        if (hasCreated.current) return;
        hasCreated.current = true;

        const createResume = async () => {
            try {
                const res = await fetch("/api/resumes", {
                    method: "POST",
                });
                const data = await res.json();
                if (res.status === 403 && data.error === "limit_reached") {
                    setLimitInfo({ current: data.current, limit: data.limit, plan: data.plan });
                    setShowUpgradeDialog(true);
                    return;
                }
                if (res.ok) {
                    router.push(`/dashboard/resumes/${data._id}`);
                } else {
                    console.error("Failed to create resume");
                    router.push("/dashboard/resumes");
                }
            } catch (err) {
                console.error(err);
                router.push("/dashboard/resumes");
            }
        };

        createResume();
    }, [router]);

    return (
        <>
            <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Creating your resume...</p>
            </div>
            
            <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Resume Limit Reached
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>
                                You've created {limitInfo?.current || 0} of {limitInfo?.limit || 0} resumes on the <span className="font-semibold uppercase">{limitInfo?.plan || "free"}</span> plan.
                            </p>
                            <p className="text-foreground font-medium">
                                Upgrade to Pro for unlimited resumes, 50 ATS checks/month, and 30 AI tailoring sessions!
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => router.push("/dashboard/resumes")}>
                            Go Back
                        </Button>
                        <Link href="/dashboard/billing">
                            <Button className="gap-2">
                                <Zap className="h-4 w-4" />
                                Upgrade to Pro
                            </Button>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
