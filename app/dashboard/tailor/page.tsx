import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Resume } from "@/models/Resume";
import { redirect } from "next/navigation";
import TailorClient from "./tailor-client";

async function getResumes(userId: string) {
    await connectToDatabase();
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(resumes));
}

export default async function TailorPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/login");
    }

    // @ts-ignore
    const resumes = await getResumes(session.user.id);

    return <TailorClient resumes={resumes} />;
}
