'use client'
import { getPublicFileURL } from "@/app/actions/file_url"
import { getAllProjectsBasedOnStatus, getSingleProjectByGroupAndChallenge, getUserSubmittedProjects, saveStudentGroupProject } from "@/app/actions/projects"
import WordCounter from "@/app/components/WordCounter"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { MAX_TOTAL_SIZE } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import SubmissionFileSection from "@/app/submission/[groupId]/SubmissionFileSection"
import { PROJECT_STATUS } from "@/app/types/enum"
import { UserGroupsWithEvent } from "@/app/types/group"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert, ProjectsSummaryExtended } from "@/app/types/projects"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { User } from "@supabase/supabase-js"
import { Editor } from "@tiptap/core"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import EditProjectFormSection from "./EditProjectFormSection"
import { EventAwards } from "@/app/types/event_awards"
import SubmitShowcaseProjectSection from "./SubmitShowcaseProjectSection"
import ManageProjectsSection from "./ManageProjectsSection"
const SHORT_DESCRIPTION_LENGTH = 200
const STUDENT_SUBMISSION_DESCRIPTION = 5000


const StudentManagementClient = ({ groupsWithEvents, user }: { groupsWithEvents: Array<UserGroupsWithEvent>, user: User }) => {
    const [currentPage, setCurrentPage] = useState<'create' | 'manage'>('create')
    const [userProjects, setUserProjects] = useState<Array<ProjectsSummaryExtended>>([])
    const [chosenProject, setChosenProject] = useState<ProjectsSummaryExtended | null>()
    const [chosenStatus, setChosenStatus] = useState<PROJECT_STATUS | null>(null)
    const [chosenOrder, setChosenOrder] = useState<boolean>(false)
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleGetUserProjects = async () => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getUserSubmittedProjects({ userId: user.id, status: null, ascending: false })
            if (error) {
                return { error: 'Fail to get user submitted projects' }
            }
            setUserProjects(data ?? [])
            setCurrentPage('manage')
            setIsOpenLoader(false)
            showNotification('Fetch successfully')
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
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
                    onClick={() => handleGetUserProjects()}
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
