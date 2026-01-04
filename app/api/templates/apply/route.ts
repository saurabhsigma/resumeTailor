import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTemplateById } from "@/lib/portfolio-templates";
import { updateProfileConfig } from "@/server/actions/profile-config";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { templateId } = await req.json();
        
        if (!templateId) {
            return NextResponse.json({ error: "Template ID required" }, { status: 400 });
        }

        const template = getTemplateById(templateId);
        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        // Apply template configuration to user's profile
        await updateProfileConfig({
            theme: template.theme,
            colorMode: template.colorMode,
            customColors: template.customColors,
        });

        return NextResponse.json({ 
            success: true, 
            message: "Template applied successfully",
            template: {
                name: template.name,
                theme: template.theme
            }
        });
    } catch (error) {
        console.error("Error applying template:", error);
        return NextResponse.json({ error: "Failed to apply template" }, { status: 500 });
    }
}
