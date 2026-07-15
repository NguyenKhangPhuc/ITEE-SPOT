'use client'

// Trigger rebuild to update constants
import { getPublicFileURL } from "@/app/actions/file_url"
import { saveStudentGroupProject } from "@/app/actions/projects"
import WordCounter from "@/app/components/WordCounter"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { MAX_TOTAL_SIZE, SHORT_DESCRIPTION_LENGTH, STUDENT_SUBMISSION_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import SubmissionFileSection from "@/app/submission/[groupId]/components/SubmissionFileSection"
import { EventAwardsInsert } from "@/app/types/event_awards"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert } from "@/app/types/projects"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import Link from "next/link"
import React, { SetStateAction, useState } from "react"
import { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form"

interface EditProjectFormSectionProps {
    submittedFiles: ProjectFileExtended[]
    setSubmittedFiles: React.Dispatch<SetStateAction<ProjectFileExtended[]>>,
    selectedAward: Array<ProjectAwardsInsert>,
    setSelectedAward: React.Dispatch<SetStateAction<Array<ProjectAwardsInsert>>>,
    initialEditorContent: string,
    setInitialEditorContent: React.Dispatch<SetStateAction<string>>
    register: UseFormRegister<ProjectsInsert>
    errors: FieldErrors<ProjectsInsert>
    handleSubmit: UseFormHandleSubmit<ProjectsInsert>
    control: Control,
    eventAwards: EventAwardsInsert[]
}

const EditProjectFormSection = ({
    register,
    errors,
    handleSubmit,
    submittedFiles,
    setSubmittedFiles,
    selectedAward,
    setSelectedAward,
    initialEditorContent,
    setInitialEditorContent,
    control,
    eventAwards
}: EditProjectFormSectionProps) => {
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()

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
        <form className="flex flex-col gap-3 w-full mt-7" onSubmit={handleSubmit(handleSaveProject)}>

            <div className="flex gap-5 w-full">
                <div className="input-group w-full">
                    <label className="event_input_label">Project Title</label>
                    <input
                        autoComplete="off"
                        placeholder="Project title"
                        className="event_input outline-none w-full h-[40px] placeholder:font-bold"
                        type="text"
                        {...register('project_title', {
                            required: "Project title is required",
                        })}
                    />
                    {errors.project_title && (
                        <p className="text-red-500 text-sm mt-1">{errors.project_title.message}</p>
                    )}
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
                <WordCounter control={control} fieldName="short_description" limit={200}/>
            </div>
            <div className="flex flex-col w-full">
                <label className="event_input_label">Choose your award</label>
                <div className="w-full grid grid-cols-2 gap-4">
                    {eventAwards.map((award) => {
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
    )
}

export default EditProjectFormSection