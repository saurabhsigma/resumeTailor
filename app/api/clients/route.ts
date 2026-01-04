import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Client } from "@/models/Client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, company, email, phone, notes } = body || {};

        const session = await getSession();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        await connectToDatabase();

        await Client.create({
            userId: session.user.id,
            name,
            company,
            email,
            phone,
            notes,
        });

        try { revalidatePath("/clients"); } catch (e) { /* best-effort */ }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
