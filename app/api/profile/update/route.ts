import { NextResponse } from "next/server";
import { updateProfile } from "@/server/actions/profile";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // body should match updateProfile data shape
        const result = await updateProfile(body);
        if (result?.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
