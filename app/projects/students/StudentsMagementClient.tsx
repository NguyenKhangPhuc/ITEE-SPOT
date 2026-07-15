'use client'
import { ProjectsSummaryExtended } from "@/app/types/projects"
import { useState } from "react"
import SubmitShowcaseProjectSection from "./SubmitShowcaseProjectSection"
import ManageProjectsSection from "./ManageProjectsSection"
import { UserGroupsWithEvent } from "@/app/types/group"
const SHORT_DESCRIPTION_LENGTH = 200
const STUDENT_SUBMISSION_DESCRIPTION = 5000


const StudentManagementClient = ({ groupsWithEvents, initialUserProjects }: { groupsWithEvents: Array<UserGroupsWithEvent>, initialUserProjects: Array<ProjectsSummaryExtended> }) => {
    const [currentPage, setCurrentPage] = useState<'create' | 'manage'>('create')
    const [userProjects, setUserProjects] = useState<Array<ProjectsSummaryExtended>>(initialUserProjects)

    return (
        <div className="w-full bg-white rounded-xl p-5 mt-5">
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
            <SubmitShowcaseProjectSection groupsWithEvents={groupsWithEvents} page={currentPage} />
            <ManageProjectsSection page={currentPage} userProjects={userProjects} setUserProjects={setUserProjects} />
        </div>
    )
}

export default StudentManagementClient
