import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, clientId, status, startDate, dueDate, paymentType, scope } = body || {};

        const session = await getSession();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if (!title || !clientId) return NextResponse.json({ error: "Title and Client are required" }, { status: 400 });

        await connectToDatabase();

        const project = await Project.create({
            userId: session.user.id,
            clientId,
            title,
            status,
            startDate: startDate ? new Date(startDate) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            paymentType,
            scope,
        });

        try { revalidatePath("/projects"); revalidatePath(`/clients/${clientId}`); } catch (e) { /* best-effort */ }

        return NextResponse.json({ success: true, projectId: project._id });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
