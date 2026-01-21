import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import BillingClient from "./billing-client";

export default async function BillingPage() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        redirect("/login");
    }

    return <BillingClient />;
}
