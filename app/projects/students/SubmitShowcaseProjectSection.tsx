'use client'
import { getPublicFileURL } from "@/app/actions/file_url"
import { getSingleProjectByGroupAndChallenge, saveStudentGroupProject } from "@/app/actions/projects"
import WordCounter from "@/app/components/WordCounter"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { MAX_TOTAL_SIZE, SHORT_DESCRIPTION_LENGTH, STUDENT_SUBMISSION_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import SubmissionFileSection from "@/app/submission/[groupId]/SubmissionFileSection"
import { UserGroupsWithEvent } from "@/app/types/group"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert } from "@/app/types/projects"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import EditProjectFormSection from "./EditProjectFormSection"

const SubmitShowcaseProjectSection = ({ groupsWithEvents, page }: { groupsWithEvents: Array<UserGroupsWithEvent>, page: 'create' | 'manage' }) => {
    const [selectedGroup, setSelectedGroup] = useState<UserGroupsWithEvent | null>(null)
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string>("")
    const [submittedFiles, setSubmittedFiles] = useState<ProjectFileExtended[]>([])
    const [selectedAward, setSelectedAward] = useState<Array<ProjectAwardsInsert>>([])
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const {
        register,
        reset,
        formState: { errors },
        handleSubmit,
        control
    } = useForm<ProjectsInsert>()
    const handleGroupSelect = (groupId: string) => {
        if (!groupId) {
            setSelectedGroup(null)
            setSelectedChallenge(null)
            reset()
            return
        }
        const group = groupsWithEvents.find(g => g.id === groupId) ?? null
        setSelectedGroup(group)
        setSelectedChallenge(null)
        reset()
    }

    const handleChallengeSelect = async (groupChallengeId: string) => {
        setSelectedChallenge(groupChallengeId || null)

        if (groupChallengeId && selectedGroup) {

            setIsOpenLoader(true)
            try {
                const { data, error } = await getSingleProjectByGroupAndChallenge({ group_id: selectedGroup.id, group_challenge_id: groupChallengeId })
                if (error) {
                    throw new Error(error)
                }
                setIsOpenLoader(false)
                if (data) {
                    reset(data)
                    setSubmittedFiles(data.project_files)
                    setSelectedAward(data.project_awards)
                    setInitialEditorContent(data.description ?? "")
                } else {
                    reset({
                        id: undefined,
                        github_link: "",
                        youtube_link: "",
                        short_description: "",
                        group_challenge_id: groupChallengeId,
                        group_id: selectedGroup.id,
                        created_at: undefined
                    })
                    setInitialEditorContent("")
                    setSelectedAward([])
                    setSubmittedFiles([])
                }
                showNotification("Select successfully")
            } catch (error) {
                setIsOpenLoader(false)
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }

        }
    }
    if (page != 'create') {
        return null
    }
    return (
        <>
            <div className="flex gap-5 w-full">

                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Your Participated Groups</label>
                    <select
                        onChange={(e) => handleGroupSelect(e.target.value)}
                        defaultValue=""
                        className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2"
                    >
                        <option value="">Pick an option</option>
                        {groupsWithEvents.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.group_name ?? "Unnamed Group"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Challenge</label>
                    <select
                        onChange={(e) => handleChallengeSelect(e.target.value)}
                        defaultValue=""
                        disabled={!selectedGroup}
                        className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">Pick an option</option>
                        {selectedGroup?.group_challenge.map((gc) => (
                            <option key={gc.id ?? ""} value={gc.id ?? ""}>
                                {gc.event_challenges?.title ?? "Unnamed Challenge"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedGroup && selectedChallenge && (
                <EditProjectFormSection
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    submittedFiles={submittedFiles}
                    setSubmittedFiles={setSubmittedFiles}
                    selectedAward={selectedAward}
                    setSelectedAward={setSelectedAward}
                    initialEditorContent={initialEditorContent}
                    setInitialEditorContent={setInitialEditorContent}
                    control={control}
                    eventAwards={selectedGroup.events?.event_awards ?? []}
                />
            )}
        </>
    )
}

export default SubmitShowcaseProjectSection