import { FitAssessmentTool } from "@/components/ui/FitAssessmentTool";

export async function FitAssessmentSection() {
    return (
        <section id="fit-assessment" className="py-20 px-6 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
                <FitAssessmentTool />
            </div>
        </section>
    );
}
