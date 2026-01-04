"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreatePortfolioPage() {
    const router = useRouter();

    useEffect(() => {
        const createPortfolio = async () => {
            try {
                const res = await fetch("/api/portfolios", {
                    method: "POST",
                });
                if (res.ok) {
                    const data = await res.json();
                    router.push(`/dashboard/portfolios/${data._id}`);
                } else {
                    console.error("Failed to create portfolio");
                    router.push("/dashboard/portfolios");
                }
            } catch (err) {
                console.error(err);
                router.push("/dashboard/portfolios");
            }
        };

        createPortfolio();
    }, [router]);

    return (
        <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Creating your portfolio...</p>
        </div>
    );
}
