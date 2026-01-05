import React from "react";
import { Mail, MapPin, Phone, Linkedin, Globe, Github } from "lucide-react";

export const TemplateModern = ({ data }: { data: any }) => {
    const { personalInfo, summary, experience, education, skills, projects } = data;

    return (
        <div className="w-full h-full bg-white p-8 text-slate-800 font-sans">
            <header className="border-b-4 border-blue-600 pb-6 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-wider text-slate-900">{personalInfo?.fullName}</h1>
                <p className="text-xl text-blue-600 mt-2 font-medium">{experience?.[0]?.role || "Professional"}</p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                    {personalInfo?.email && <div className="flex items-center gap-1"><Mail size={14} /> {personalInfo.email}</div>}
                    {personalInfo?.phone && <div className="flex items-center gap-1"><Phone size={14} /> {personalInfo.phone}</div>}
                    {personalInfo?.location && <div className="flex items-center gap-1"><MapPin size={14} /> {personalInfo.location}</div>}
                    {personalInfo?.linkedin && <div className="flex items-center gap-1"><Linkedin size={14} /> {personalInfo.linkedin}</div>}
                    {personalInfo?.website && <div className="flex items-center gap-1"><Globe size={14} /> {personalInfo.website}</div>}
                </div>
            </header>

            <div className="grid grid-cols-3 gap-8">
                <main className="col-span-2 space-y-6">
                    {summary && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest text-slate-400 mb-3">Profile</h2>
                            <p className="leading-relaxed text-slate-700">{summary}</p>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                                            <span className="text-sm text-slate-500 font-medium">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                        </div>
                                        <div className="text-blue-600 font-medium mb-2">{exp.company}</div>
                                        <p className="text-sm text-slate-600 whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest text-slate-400 mb-4">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                            {proj.url && <a href={proj.url} className="text-xs text-blue-500 hover:replace underline">Link</a>}
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <aside className="col-span-1 space-y-8 bg-slate-50 p-4 rounded-lg h-fit">
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4 border-b pb-2">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu: any, i: number) => (
                                    <div key={i}>
                                        <div className="font-bold text-slate-800">{edu.school}</div>
                                        <div className="text-sm text-slate-600">{edu.degree} in {edu.field}</div>
                                        <div className="text-xs text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4 border-b pb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};
