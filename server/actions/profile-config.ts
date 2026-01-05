"use server";

import { getSession } from "@/lib/auth";

export async function updateProfileConfig(data: any) {
    const session = await getSession();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }
    // Placeholder
    return { success: true };
}
