import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body || {};

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash: hashedPassword,
        });

        await login({ id: user._id.toString(), email: user.email, name: user.name });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
