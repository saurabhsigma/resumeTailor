import { PortfolioTemplate1 } from "@/components/portfolio-templates/Template1";
import { PortfolioTemplate2 } from "@/components/portfolio-templates/Template2";
import { PortfolioTemplate3 } from "@/components/portfolio-templates/Template3";
import { PortfolioTemplate4 } from "@/components/portfolio-templates/Template4";
import { PortfolioTemplate5 } from "@/components/portfolio-templates/Template5";
import { PortfolioTemplate6 } from "@/components/portfolio-templates/Template6";

const TEMPLATES = {
    template1: PortfolioTemplate1,
    template2: PortfolioTemplate2,
    template3: PortfolioTemplate3,
    template4: PortfolioTemplate4,
    template5: PortfolioTemplate5,
    template6: PortfolioTemplate6,
};

export const PortfolioThumbnail = ({ portfolio }: { portfolio: any }) => {
    const SelectedTemplate = TEMPLATES[portfolio.theme as keyof typeof TEMPLATES] || PortfolioTemplate1;

    return (
        <div className="w-full h-full flex items-start justify-center overflow-hidden bg-white">
            <div className="w-[1920px] h-[1080px] origin-top scale-[0.18] pointer-events-none select-none">
                <SelectedTemplate data={portfolio} />
            </div>
        </div>
    );
};
