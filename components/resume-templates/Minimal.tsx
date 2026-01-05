import React from "react";

export const TemplateMinimal = ({ data }: { data: any }) => {
    const { personalInfo, summary, experience, education, skills } = data;

    return (
        <div className="w-full h-full bg-white p-10 text-neutral-800 font-sans text-sm">
            <div className="grid grid-cols-12 gap-8 h-full">
                {/* Left Sidebar */}
                <div className="col-span-4 border-r pr-6 space-y-8">
                    <div>
                        <h1 className="text-2xl font-light mb-1">{personalInfo?.fullName?.split(" ")[0]}</h1>
                        <h1 className="text-2xl font-bold mb-4">{personalInfo?.fullName?.split(" ").slice(1).join(" ")}</h1>
                        <p className="text-neutral-500 mb-6">{experience?.[0]?.role}</p>

                        <div className="space-y-2 text-xs text-neutral-600">
                            {personalInfo?.email && <div className="break-all">{personalInfo.email}</div>}
                            {personalInfo?.phone && <div>{personalInfo.phone}</div>}
                            {personalInfo?.location && <div>{personalInfo.location}</div>}
                            {personalInfo?.website && <a href={personalInfo.website} className="block hover:underline">{personalInfo.website}</a>}
                        </div>
                    </div>

                    {education?.length > 0 && (
                        <section>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-4 text-neutral-400">Education</h3>
                            <div className="space-y-4">
                                {education.map((edu: any, i: number) => (
                                    <div key={i}>
                                        <div className="font-semibold">{edu.school}</div>
                                        <div className="text-neutral-500">{edu.degree}</div>
                                        <div className="text-neutral-400 text-xs mt-1">{edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-4 text-neutral-400">Skills</h3>
                            <div className="flex flex-col gap-2">
                                {skills.map((skill: string, i: number) => (
                                    <div key={i} className="text-neutral-700 border-b border-neutral-100 pb-1">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Content */}
                <div className="col-span-8 space-y-8 pt-2">
                    {summary && (
                        <section>
                            <p className="leading-relaxed text-neutral-600">{summary}</p>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-neutral-400 border-b pb-2">Experience</h3>
                            <div className="space-y-8">
                                {experience.map((exp: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="font-bold text-neutral-800">{exp.role}</h4>
                                            <span className="text-xs text-neutral-400">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                        </div>
                                        <div className="text-neutral-500 font-medium mb-3 text-xs uppercase">{exp.company}</div>
                                        <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
