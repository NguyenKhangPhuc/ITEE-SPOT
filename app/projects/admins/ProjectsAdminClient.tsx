'use client'
import { ProjectsSummary } from "@/app/types/projects"
import Link from "next/link"
import { useState } from "react"
import { EventWithGroupsAndAward } from "@/app/types/event"
import CreateShowCaseProjectSection from "./CreateShowCaseProjectSection"
import ManageProjectsSection from "../students/ManageProjectsSection"
import AdminProjectManageSection from "./AdminProjectManageSection"

const ProjectsAdminClient = ({ projects, eventsWithGroupsAndAwards }: { projects: Array<ProjectsSummary> | null, eventsWithGroupsAndAwards: Array<EventWithGroupsAndAward> }) => {
    const [currentPage, setCurrentPage] = useState<'create' | 'manage'>('create')
    const [currentProjects, setCurrentProjects] = useState<ProjectsSummary[]>(projects ?? [])



    return (
        <div className="w-full bg-white p-5 rounded-xl mt-5">
            <div className="w-full flex gap-5 pb-10">
                <button className={`duration-300 cursor-pointer ${currentPage == 'create' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${currentPage == 'create' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => setCurrentPage('create')}
                >
                    Create/Edit Project
                </button>
                <button className={`duration-300 cursor-pointer ${currentPage == 'manage' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${currentPage == 'manage' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => setCurrentPage('manage')}
                >
                    Managing Projects
                </button>
            </div>
            <CreateShowCaseProjectSection page={currentPage} eventsWithGroupsAndAwards={eventsWithGroupsAndAwards} />
            <AdminProjectManageSection page={currentPage} setCurrentProjects={setCurrentProjects} currentProjects={currentProjects} />
        </div>
    )
}

export default ProjectsAdminClient