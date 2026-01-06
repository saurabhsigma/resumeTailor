"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateResumePage() {
    const router = useRouter();

    const hasCreated = useRef(false);

    useEffect(() => {
        if (hasCreated.current) return;
        hasCreated.current = true;

        const createResume = async () => {
            try {
                const res = await fetch("/api/resumes", {
                    method: "POST",
                });
                if (res.ok) {
                    const data = await res.json();
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
        <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Creating your resume...</p>
        </div>
    );
}
