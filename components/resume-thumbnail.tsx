import { TemplateModern } from "@/components/resume-templates/Modern";
import { TemplateClassic } from "@/components/resume-templates/Classic";
import { TemplateMinimal } from "@/components/resume-templates/Minimal";

const TEMPLATES = {
    modern: TemplateModern,
    classic: TemplateClassic,
    minimal: TemplateMinimal,
};

export const ResumeThumbnail = ({ resume }: { resume: any }) => {
    const SelectedTemplate = TEMPLATES[resume.theme as keyof typeof TEMPLATES] || TemplateModern;

    return (
        <div className="w-full h-full flex items-start justify-center overflow-hidden bg-white">
            <div className="w-[210mm] h-[297mm] origin-top scale-[0.32] shadow-sm">
                <SelectedTemplate data={resume} />
            </div>
        </div>
    );
};
