import React from "react";

export const TemplateClassic = ({ data }: { data: any }) => {
    const { personalInfo, summary, experience, education, skills, projects } = data;

    return (
        <div className="w-full h-full bg-white p-12 text-gray-900 font-serif">
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                <h1 className="text-3xl font-bold mb-2">{personalInfo?.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-4 text-sm">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>• {personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
                </div>
            </div>

            {summary && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg border-b border-gray-300 mb-3 uppercase tracking-wider">Professional Summary</h2>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </section>
            )}

            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg border-b border-gray-300 mb-4 uppercase tracking-wider">Experience</h2>
                    <div className="space-y-5">
                        {experience.map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-md">{exp.company}</h3>
                                    <span className="text-sm italic">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="text-sm font-semibold mb-1 italic">{exp.role}</div>
                                <p className="text-sm whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg border-b border-gray-300 mb-4 uppercase tracking-wider">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between">
                                <div>
                                    <div className="font-bold">{edu.school}</div>
                                    <div className="text-sm">{edu.degree} in {edu.field}</div>
                                </div>
                                <div className="text-sm italic">{edu.startDate} – {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills?.length > 0 && (
                <section>
                    <h2 className="font-bold text-lg border-b border-gray-300 mb-3 uppercase tracking-wider">Skills</h2>
                    <p className="text-sm leading-relaxed">
                        {skills.join(", ")}
                    </p>
                </section>
            )}
        </div>
    );
};
