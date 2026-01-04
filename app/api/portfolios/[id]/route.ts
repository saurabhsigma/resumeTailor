import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const portfolio = await Portfolio.findOne({ _id: id, userId: session.user.id });

    if (!portfolio) {
        return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json(portfolio);
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

        // Ensure subdomain uniqueness if changing
        if (data.subdomain) {
            const existing = await Portfolio.findOne({ subdomain: data.subdomain, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ message: "Subdomain already taken" }, { status: 400 });
            }
        }

        const portfolio = await Portfolio.findOneAndUpdate(
            // @ts-ignore
            { _id: id, userId: session.user.id },
            { ...data },
            { new: true }
        );

        if (!portfolio) {
            return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
        }

        return NextResponse.json(portfolio);
    } catch (error) {
        return NextResponse.json({ message: "Error updating portfolio" }, { status: 500 });
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
    const result = await Portfolio.deleteOne({ _id: id, userId: session.user.id });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Portfolio deleted" });
}
