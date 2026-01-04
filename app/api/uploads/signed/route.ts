import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { filename } = await req.json();

        // Create a unique public_id
        // Using timestamp + sanitized filename
        const timestamp = Math.round(new Date().getTime() / 1000);
        const public_id = `freelancer_os/${timestamp}-${filename.replace(/\s+/g, "_").split('.')[0]}`;

        const signature = cloudinary.utils.api_sign_request({
            timestamp,
            public_id,
            folder: "freelancer_os",
        }, process.env.CLOUDINARY_API_SECRET!);

        return NextResponse.json({
            signature,
            timestamp,
            public_id,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            folder: "freelancer_os"
        });
    } catch (error) {
        console.error("Error generating signature:", error);
        return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
    }
}

