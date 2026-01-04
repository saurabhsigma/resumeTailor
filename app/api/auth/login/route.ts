import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body || {};

        if (!email || !password) {
            return NextResponse.json({ error: "Please provide both email and password." }, { status: 400 });
        }

        await connectToDatabase();
        console.log("j1");

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: "Invalid credential." }, { status: 401 });
        console.log("hello");
        console.log("user: ",user);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        console.log("password: ",isMatch);

        await login({ id: user._id.toString(), email: user.email, name: user.name });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
