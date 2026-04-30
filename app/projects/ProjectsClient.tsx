'use client'
import Link from "next/link";
import { AWARD_TYPE, EVENT_STATUS } from "../types/enum";
import { ProjectsSummary } from "../types/projects"
import { createClient } from "../utils/supabase/client";
import Image from 'next/image'
import { useState } from "react";
import { getAllEvents } from "../actions/events";
import { getAllProject } from "../actions/projects";
import { useNotification } from "../context/NotificationContext";
import { useLoader } from "../context/LoaderContext";
import Pagination from "../components/Pagination";
const ProjectsClient = ({ projects, totalPages }: { projects: Array<ProjectsSummary> | null, totalPages: number | undefined }) => {
    const supabase = createClient()
    const [chosenPage, setChosenPage] = useState(1)
    const [visibleProjects, setVisibleProjects] = useState({ projects, totalPages })
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleGetUrl = (imagePath: string) => {
        console.log("This is image path" + imagePath)
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case EVENT_STATUS.ONGOING: return 'text-green-600';
            case EVENT_STATUS.FINISHED: return 'text-red-500';
            default: return 'text-gray-600';
        }
    };
    const getAwardColor = (type: string) => {
        switch (type) {
            case AWARD_TYPE.GENERAL: return 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200';
            case AWARD_TYPE.SPECIFIC: return 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200';
            case AWARD_TYPE.PARTICIPANT: return 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200';
            default: return 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200';
        }
    }

    const handleChoosePage = async (page: number) => {
        setIsOpenLoader(true)
        try {
            const { data, totalPages, error } = await getAllProject({ page })
            if (error) {
                throw new Error('Fail to change page')
            }

            setVisibleProjects({ projects: data ?? [], totalPages: totalPages })
            setChosenPage(page)
            setIsOpenLoader(false)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <div className="w-full flex flex-col gap-8 pt-5">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {visibleProjects.projects?.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => console.log("This is image path" + project.groups?.events?.poster_path)}
                    >
                        {project.groups?.events?.poster_path != null ?
                            <div className="w-full h-[300px] relative overflow-hidden bg-gray-200">
                                <Image
                                    src={handleGetUrl(project.groups?.events?.poster_path || "")}
                                    alt={project.groups?.group_name || "Project thumbnail"}
                                    fill
                                    className="object-cover hover:scale-105 duration-300"
                                    priority={false}
                                />
                            </div> :
                            <div className="w-full relative overflow-hidden bg-black flex items-center justify-center text-white font-bold">
                                No image
                            </div>}



                        <div className="p-5 flex flex-col flex-grow">
                            <div className="text-sm font-bold text-gray-600 uppercase flex gap-2 items-center mb-2">
                                <span className="truncate max-w-[150px]">
                                    {project.groups?.events?.title || "Unknown Event"}
                                </span>
                                <span>•</span>
                                <span className={getStatusColor(project.groups?.events?.status ?? "")}>
                                    {project.groups?.events?.status || "N/A"}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-1 truncate">
                                {project.groups?.group_name || "Untitled Group"}
                            </h3>

                            <div className="min-h-[24px] mb-2">
                                {project.event_awards?.award_title && (
                                    <span className={`text-xs font-semibold ${getAwardColor(project.event_awards.award_type ?? '')}`}>
                                        {project.event_awards.award_title}
                                    </span>
                                )}
                            </div>

                            <div className="w-full flex flex-col  lg:items-start justify-center items-center mb-6">
                                <p className="text-sm font-bold">Short Description</p>
                                <p className="text-sm text-gray-800 line-clamp-2 leading-tight w-full lg:text-start text-center">
                                    {project.groups?.short_description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, esse cillum..."}
                                </p>
                            </div>


                            <div className="mt-auto">
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="duration-300 cursor-pointer text-black p-5 text-center w-full h-13 border-4 border-black bg-white hover:scale-102 rounded-[10px] flex items-center justify-center font-bold text-sm"
                                >
                                    See the project
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            <Pagination totalPages={visibleProjects.totalPages} chosenPage={chosenPage} handleChoosePage={handleChoosePage} />
        </div>
    )
}


export default ProjectsClient