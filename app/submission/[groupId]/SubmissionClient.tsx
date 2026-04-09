'use client'
import { getGoupChallengeSubmission, saveGroupChallengeSubmission } from "@/app/actions/submissions"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { useNotification } from "@/app/context/NotificationContext"
import { EventChallenge } from "@/app/types/event_challenges"
import { GroupChallengeRelation } from "@/app/types/group_challenge"
import { SubmissionInsert } from "@/app/types/submission"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { getPublicFileURL, getSignedUrl } from "@/app/actions/file_url"
import { EXAMPLE_PROJECT_SUMMANRY, SHORT_DESCRIPTION_LENGTH, STUDENT_SUBMISSION_DESCRIPTION } from "@/app/constants"
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor"
import Link from "next/link"
import { useLoader } from "@/app/context/LoaderContext"
import FunFactsCreationForm from "./FunFactsCreationForm"
import { FunFactsInsert } from "@/app/types/funfacts"
const SubmissionClient = ({ groupChallenges, eventChallenges, group_id }: { groupChallenges: Array<GroupChallengeRelation>, eventChallenges: Array<EventChallenge>, group_id: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<SubmissionInsert>()
    const descriptionValue = useWatch({
        control: control,
        name: "short_description",
        defaultValue: "",
    });
    const MAX_TOTAL_SIZE = 5 * 1024 * 1024;
    const [chosenGroupChallenges, setChosenGroupChallenges] = useState<number | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null)
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const [submittedFiles, setSubmittedFiles] = useState<Array<SubmissionFileExtended>>([])
    const [funfacts, setFunFacts] = useState<Array<FunFactsInsert>>([])
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleCatchFiles = (file: File) => {
        const currentFilesSize = submittedFiles.reduce((acc, submittedFile) => acc + submittedFile.size!, 0);
        if (currentFilesSize + file.size > MAX_TOTAL_SIZE) {
            showNotification("File uploaded exceed 5MB")
        } else {
            const newFile: SubmissionFileExtended = {
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

    const handleDownloadFile = async (file: SubmissionFileExtended) => {
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

    const handleSaveSubmission = async (data: SubmissionInsert) => {
        setIsOpenLoader(true)
        try {
            data.group_id = group_id
            data.group_challenge_id = groupChallenges[chosenGroupChallenges!].id
            data.description = editorValue?.getHTML()
            if (data.group_id == null || data.group_id == "") {
                throw new Error('Fail to save because unknown error')
            }
            if (data.group_challenge_id == null || data.group_challenge_id == "") {
                throw new Error('Fail to save because unknown error')
            }

            const { error } = await saveGroupChallengeSubmission({ submission: data, submittedFiles, funfacts })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification('Save submission successfully')
        } catch (error) {

            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }

    const handleChooseChallengeSubmission = async (index: number) => {
        try {
            const { data, error } = await getGoupChallengeSubmission({
                groupChallengeId: groupChallenges[index].id,
                groupId: groupChallenges[index].group_id!,
            })
            if (error) {
                throw new Error(error)
            }
            setChosenGroupChallenges(index)
            if (data) {
                reset(data)
                setInitialEditorContent(data.description)
                setSubmittedFiles(data.submission_files!)
                setFunFacts(data.fun_facts)
            } else {
                reset({
                    id: undefined,
                    github_link: "",
                    youtube_link: "",
                    short_description: "",
                    group_challenge_id: undefined,
                    group_id: undefined,
                    created_at: undefined
                })
                setInitialEditorContent(null)
                setSubmittedFiles([])
                setFunFacts([])
            }

        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleGetEmbeddedUrl = () => {
        const currentLink = getValues('youtube_link');
        try {
            const urlObj = new URL(currentLink ?? "");
            let videoId = "";

            if (urlObj.hostname.includes("youtube.com")) {
                videoId = urlObj.searchParams.get("v")!;
            } else if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.slice(1);
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (e) {
            return null;
        }
    }
    return (
        <form className="flex flex-col mt-5 p-5 gap-5 items-start content-main-color rounded-xl" onSubmit={handleSubmit(handleSaveSubmission)}>
            <div className="flex flex-col gap-4 w-full mt-4">
                <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {eventChallenges.map((challenge, index) => (
                        <div key={challenge.id} className={`rounded-xl group relative cursor-pointer duration-300 ${chosenGroupChallenges == index ? 'shadow-xl/30 translate-y-2' : ''}`
                        } onClick={() => handleChooseChallengeSubmission(index)}>

                            <div className="relative w-full p-5 border rounded-xl peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                                <div className="text-sm w-2/3 font-light">{challenge.company_name}</div>
                                <h4 className="font-bold w-2/3">{challenge.title}</h4>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {chosenGroupChallenges != null &&
                <>
                    <div className="input-group w-full">
                        <label className="event_input_label">Project title</label>
                        <input autoComplete="off" placeholder="Project Title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                            {...register('title', {
                                required: "Project title is required",
                            })} />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div className="input-group w-full">
                        <label className="event_input_label">Github Link</label>
                        <input autoComplete="off" placeholder="Github source code link" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                            {...register('github_link', {
                                required: "Github link is required",
                            })} />
                        {errors.github_link && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.github_link.message}
                            </p>
                        )}
                    </div>
                    <div className="input-group w-full">
                        <label className="event_input_label">Youtube Link</label>
                        <input autoComplete="off" placeholder="Demo video link" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                            {...register('youtube_link')} />
                        {errors.youtube_link && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.youtube_link.message}
                            </p>
                        )}
                    </div>
                    <YoutubeVideo embeddedUrl={handleGetEmbeddedUrl() ?? ""} />
                    <div className="input-group w-full ">
                        <label className="event_input_label">Short Description</label>
                        <textarea
                            maxLength={SHORT_DESCRIPTION_LENGTH}
                            autoComplete="off"
                            placeholder="Short Description"
                            className="event_input outline-none w-full placeholder:font-bold h-[80px]"
                            {...register('short_description', {
                                required: "Short description is required",
                            })}
                        />
                        {errors.short_description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.short_description.message}
                            </p>
                        )}
                        <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '14px' }}>
                            <span style={{ color: (descriptionValue?.length ?? 0) >= SHORT_DESCRIPTION_LENGTH ? 'red' : 'gray' }}>
                                {descriptionValue?.length ?? 0}
                            </span>
                            /{SHORT_DESCRIPTION_LENGTH} Characters
                        </div>
                    </div>
                    <FunFactsCreationForm funfacts={funfacts} setFunFacts={setFunFacts} />

                    <div className="flex flex-col gap-4 h-[600px] shadow-xl p-5">
                        <label className="event_input_label">Example Submission Description</label>
                        <ReadOnlyEditor content={EXAMPLE_PROJECT_SUMMANRY} />
                    </div>

                    <div className="shadow-xl/30 inset-shadow-sm rounded-xl w-full">
                        <SimpleEditor initialContent={initialEditorContent} onEditorReady={setEditorValue} limit={STUDENT_SUBMISSION_DESCRIPTION} />
                    </div>
                    <div className="relative w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors group">
                        <div className="text-center pointer-events-none">
                            <p className="text-gray-600">
                                <span className="font-semibold">Paste or drop a file here</span> or click to upload
                            </p>
                            <p className="text-xs text-gray-400">PDF, WORD, PPTX (max. 5MB)</p>
                        </div>

                        <input
                            type="file"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept=".pdf, .doc, .docx, .ppt, .pptx"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    handleCatchFiles(files[0]);
                                }
                            }}
                        />
                    </div>
                    {submittedFiles?.length > 0 && (

                        <div className="grid lg:grid-cols-7 md:grid-cols-5 grid-cols-3 gap-4 w-full">
                            {submittedFiles.map((fileItem, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleDownloadFile(fileItem)}
                                    className="cursor-pointer relative h-30 min-w-full flex flex-col items-center justify-center p-2 bg-white rounded-md border border-gray-100 shadow-xl shadow-black/30 hover:scale-102 group duration-300 cursor"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFiles(index);
                                        }}
                                        className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors z-10"
                                        type="button"
                                    >
                                        <ClearIcon />
                                    </button>

                                    <button

                                        className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 text-black transition-opacity duration-300"
                                        type="button"
                                    >
                                        <DownloadIcon sx={{ fontSize: '18px' }} />
                                    </button>

                                    <div className="text-gray-400 mb-1">
                                        <InsertDriveFileIcon />
                                    </div>

                                    <span className="text-[13px] text-center font-medium text-black break-all line-clamp-2 px-1">
                                        {fileItem.original_file_name}
                                    </span>
                                </div>
                            ))}
                        </div>

                    )}
                    <div className="w-full flex gap-5">
                        <button
                            type="submit"
                            className="cursor-pointer w-1/2 h-13 rounded-[10px] bg-black hover:bg-black/80 transition-colors duration-300 text-white hover:scale-102"
                        >
                            Save your submission
                        </button>
                        <Link href={`/submission/${group_id}/read-only`} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-1/2 h-13 border-4 border-black bg-white 
                     hover:scale-102 rounded-[10px] flex items-center justify-center ">
                            See your submission
                        </Link>
                    </div>
                </>
            }

        </form>
    )
}

export default SubmissionClient