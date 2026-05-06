'use client'
import { getPublicFileURL } from "@/app/actions/file_url"
import { getSingleProjectByGroupAndChallenge, saveStudentGroupProject } from "@/app/actions/projects"
import WordCounter from "@/app/components/WordCounter"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { MAX_TOTAL_SIZE } from "@/app/constants"
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
import { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
const SHORT_DESCRIPTION_LENGTH = 200
const STUDENT_SUBMISSION_DESCRIPTION = 5000


const StudentManagementClient = ({ groupsWithEvents }: { groupsWithEvents: Array<UserGroupsWithEvent> }) => {
    const [selectedGroup, setSelectedGroup] = useState<UserGroupsWithEvent | null>(null)
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string>("")
    const [submittedFiles, setSubmittedFiles] = useState<ProjectFileExtended[]>([])
    const [selectedAward, setSelectedAward] = useState<Array<ProjectAwardsInsert>>([])
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const {
        register,
        reset,
        setValue,
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
                console.log(data)
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
    const handleCatchFiles = (file: File) => {
        const currentFilesSize = submittedFiles.reduce((acc, submittedFile) => acc + submittedFile.size!, 0);
        if (currentFilesSize + file.size > MAX_TOTAL_SIZE) {
            showNotification("File uploaded exceed 5MB")
        } else {
            const newFile: ProjectFileExtended = {
                original_file_name: file.name,
                size: file.size,
                mime_type: file.type,
                file: file
            }
            setSubmittedFiles([...submittedFiles, newFile])
        }
    }

    const handleDeleteFiles = (fileIndex: number) => {
        const updatedFiles = submittedFiles.filter((file, index) => index != fileIndex)
        setSubmittedFiles(updatedFiles)
    }

    const handleDownloadFile = async (file: ProjectFileExtended) => {
        if (file.storage_path != null && file.storage_path != "") {
            try {
                const { data, error } = await getPublicFileURL(file.storage_path)
                if (error) {
                    throw new Error(error)
                }
                if (!data) {
                    throw new Error("Fail to load url")
                }
                if (data.publicUrl) {
                    window.open(data.publicUrl, '_blank');
                }
            } catch (error) {

                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        } else {
            const localUrl = URL.createObjectURL(file.file!);
            window.open(localUrl, '_blank');
        }
    }

    const handleCheckIsSelected = (awardId: string) => {
        if (selectedAward.find((ele) => ele.award_id == awardId)) {
            return true
        }
        console.log(false)
        return false
    }

    const handleSelectingAward = (awardId: string) => {
        if (selectedAward.find((ele) => ele.award_id == awardId)) {
            const filteredOutAward = selectedAward.filter((ele) => {
                return ele.award_id != awardId
            })
            setSelectedAward(filteredOutAward)

        } else {
            const newAward: ProjectAwardsInsert = {
                award_id: awardId,
            }
            setSelectedAward([...selectedAward, newAward])
        }
    }

    const handleSaveProject = async (project: ProjectsInsert) => {
        setIsOpenLoader(true)
        try {
            console.log("Project before saving " + project)
            console.log("Selected Award ", selectedAward)
            project.description = editorValue?.getHTML()
            const { data, error } = await saveStudentGroupProject({ project, submittedFiles, projectAwards: selectedAward })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification("Update successfully")
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <div className="w-full bg-white rounded-xl p-5 mt-5">

            <div className="flex gap-5 w-full mb-6">

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
                <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(handleSaveProject)}>

                    <div className="flex gap-5 w-full">
                        <div className="input-group w-1/2">
                            <label className="event_input_label">Event Name</label>
                            <input
                                autoComplete="off"
                                placeholder="Event Name"
                                className="event_input outline-none w-full h-[40px] placeholder:font-bold cursor-not-allowed opacity-70"
                                type="text"
                                disabled
                                value={selectedGroup.events?.title ?? "Unknown Event"}
                            />
                        </div>

                        <div className="input-group w-1/2">
                            <label className="event_input_label">Group Name</label>
                            <input
                                autoComplete="off"
                                placeholder="Group Name"
                                className="event_input outline-none w-full h-[40px] placeholder:font-bold cursor-not-allowed opacity-70"
                                type="text"
                                disabled
                                value={selectedGroup.group_name ?? "Unknown group"}
                            />
                        </div>
                    </div>

                    <div className="flex gap-5 w-full">
                        <div className="input-group w-1/2">
                            <label className="event_input_label">Github Link</label>
                            <input
                                autoComplete="off"
                                placeholder="Github source code link"
                                className="event_input outline-none w-full h-[40px] placeholder:font-bold"
                                type="text"
                                {...register("github_link", {
                                    required: "Github link is required",
                                })}
                            />
                            {errors.github_link && (
                                <p className="text-red-500 text-sm mt-1">{errors.github_link.message}</p>
                            )}
                        </div>

                        <div className="input-group w-1/2">
                            <label className="event_input_label">Youtube Link</label>
                            <input
                                autoComplete="off"
                                placeholder="Demo video link"
                                className="event_input outline-none w-full h-[40px] placeholder:font-bold"
                                type="text"
                                {...register("youtube_link")}
                            />
                            {errors.youtube_link && (
                                <p className="text-red-500 text-sm mt-1">{errors.youtube_link.message}</p>
                            )}
                        </div>
                    </div>



                    <YoutubeVideo control={control} />



                    <div className="input-group w-full">
                        <label className="event_input_label">Short Description</label>
                        <textarea
                            maxLength={SHORT_DESCRIPTION_LENGTH}
                            autoComplete="off"
                            placeholder="Short Description"
                            className="event_input outline-none w-full placeholder:font-bold h-[80px]"
                            {...register("short_description", {
                                required: "Short description is required",
                            })}
                        />
                        {errors.short_description && (
                            <p className="text-red-500 text-sm mt-1">{errors.short_description.message}</p>
                        )}
                        <WordCounter control={control} />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="event_input_label">Choose your award</label>
                        <div className="w-full grid grid-cols-2 gap-4">
                            {selectedGroup?.events?.event_awards?.map((award) => {
                                return (
                                    <div key={`award - ${award.id}`} className={`duration-300 cursor-pointer
                     p-5 text-center w-full h-13 border-4 border-black ${handleCheckIsSelected(award.id ?? "") ? 'bg-black text-white' : 'bg-white text-black'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center `}
                                        onClick={() => handleSelectingAward(award.id ?? "")}
                                    >
                                        {award.award_title}
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    <div className="shadow-xl/30 inset-shadow-sm rounded-xl w-full">
                        <SimpleEditor
                            initialContent={initialEditorContent}
                            onEditorReady={setEditorValue}
                            limit={STUDENT_SUBMISSION_DESCRIPTION}
                        />
                    </div>
                    <SubmissionFileSection
                        submittedFiles={submittedFiles}
                        handleCatchFiles={handleCatchFiles}
                        handleDeleteFiles={handleDeleteFiles}
                        handleDownloadFile={handleDownloadFile} />
                    <div className="w-full flex gap-5">
                        <button
                            type="submit"
                            className="cursor-pointer w-1/2 h-13 rounded-[10px] bg-black hover:bg-black/80 transition-colors duration-300 text-white hover:scale-102"
                        >
                            Save your submission
                        </button>
                        <Link href={``} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-1/2 h-13 border-4 border-black bg-white 
                     hover:scale-102 rounded-[10px] flex items-center justify-center ">
                            View project
                        </Link>
                    </div>
                </form>
            )}
        </div>
    )
}

export default StudentManagementClient
