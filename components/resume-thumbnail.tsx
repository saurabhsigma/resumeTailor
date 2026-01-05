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
        <div className="w-[210mm] h-[297mm] bg-white overflow-hidden text-[10px] select-none pointer-events-none origin-top-left scale-[0.2]">
            <SelectedTemplate data={resume} />
        </div>
    );
};
