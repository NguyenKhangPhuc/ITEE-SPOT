'use client'
import Link from "next/link";
import { AWARD_TYPE, EVENT_STATUS } from "../types/enum";
import { ProjectsSummaryExtended } from "../types/projects";
import { createClient } from "../utils/supabase/client";
import Image from 'next/image';
import { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
interface ProjectsSectionProps {
    projects: Array<ProjectsSummaryExtended> | null;
    title: string;
}

const ProjectsSection = ({ projects, title }: ProjectsSectionProps) => {
    const supabase = createClient();
    const [visibleCount, setVisibleCount] = useState(3);

    const visibleProjects = projects?.slice(0, visibleCount) ?? [];
    const isExpanded = visibleCount >= (projects?.length ?? 0);

    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case EVENT_STATUS.ONGOING: return 'text-green-600 bg-green-50';
            case EVENT_STATUS.FINISHED: return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getAwardColor = (type: string) => {
        switch (type) {
            case AWARD_TYPE.GENERAL:
            case AWARD_TYPE.SPECIFIC:
                return '#e94822';
            case AWARD_TYPE.PARTICIPANT:
                return '#2f43ba';
            default:
                return '#858585';
        }
    };

    if (!projects || projects.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-6 pt-5">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {projects.length > 3 && (
                    <button
                        onClick={() =>
                            isExpanded
                                ? setVisibleCount(3)
                                : setVisibleCount(projects.length)
                        }
                        className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-white transition-colors duration-300"
                    >
                        {isExpanded ? (
                            <>
                                Close <KeyboardArrowUpIcon />
                            </>
                        ) : (
                            <>
                                Open <KeyboardArrowDownIcon />
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="w-full flex flex-col gap-4">
                {visibleProjects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex sm:flex-row flex-col shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="xl:w-[300px] sm:min-w-[280px] w-full h-[300px] relative flex-shrink-0 bg-gray-300">
                            {project.groups?.events?.poster_path ? (
                                <Image
                                    src={handleGetUrl(project.groups.events.poster_path)}
                                    alt={project.groups?.group_name || "Project thumbnail"}
                                    fill
                                    className="object-cover hover:scale-105 duration-300"
                                    priority={false}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-sm font-semibold tracking-wide">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col flex-1 p-5 gap-3 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate max-w-[180px]">
                                    {project.groups?.events?.title || "Unknown Event"}
                                </span>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(project.groups?.events?.status ?? "")}`}>
                                    {project.groups?.events?.status || "N/A"}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-black leading-tight truncate">
                                {project.groups?.group_name || "Untitled Group"}
                            </h3>

                            {project.project_awards.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.project_awards.map((award) => {
                                        const awardColor = getAwardColor(award.event_awards?.award_type || "");
                                        return (
                                            <div
                                                key={`award-${award.award_id}`}
                                                className="flex items-center gap-1"
                                                style={{ color: awardColor }}
                                            >
                                                <svg height="18" width="18" fill={awardColor} viewBox="0 0 100 100">
                                                    <path d="M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z" />
                                                </svg>
                                                <span className="text-xs font-semibold">{award.event_awards?.award_title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
                                {project.groups?.short_description || "No description provided."}
                            </p>

                            <div className="mt-auto pt-1">
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="inline-flex items-center justify-center px-5 h-10 border-3 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors duration-300 font-bold text-sm text-black"
                                >
                                    See the project
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsSection;