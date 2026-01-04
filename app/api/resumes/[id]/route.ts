import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Resume } from "@/models/Resume";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const resume = await Resume.findOne({ _id: id, userId: session.user.id });

    if (!resume) {
        return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(resume);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        await connectToDatabase();
        const { id } = await params;

        const resume = await Resume.findOneAndUpdate(
            // @ts-ignore
            { _id: id, userId: session.user.id },
            { ...data },
            { new: true }
        );

        if (!resume) {
            return NextResponse.json({ message: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ message: "Error updating resume" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // @ts-ignore
    const { id } = await params;
    const result = await Resume.deleteOne({ _id: id, userId: session.user.id });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted" });
}
