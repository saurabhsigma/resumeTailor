import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectToDatabase from "@/lib/db";
import { Resume } from "@/models/Resume";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/resume-editor";

async function getResume(id: string, userId: string) {
    await connectToDatabase();
    // Use .lean() to get POJO, otherwise Next.js client component serialization fails for Mongoose docs
    const resume = await Resume.findOne({ _id: id, userId }).lean();
    return resume ? JSON.parse(JSON.stringify(resume)) : null;
}

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/login");
    }

    const { id } = await params;
    const resume = await getResume(id, session.user.id as string);

    if (!resume) {
        redirect("/dashboard/resumes");
    }

    return (
        <div className="h-full">
            <ResumeEditor initialData={resume} />
        </div>
    );
}
