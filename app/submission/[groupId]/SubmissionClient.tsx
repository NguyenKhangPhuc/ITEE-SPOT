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
import SubmissionFileSection from "./SubmissionFileSection"
import SubmissionBasicInfo from "./SubmissionBasicInfo"
import ChallengeSelectionSection from "./ChallengeSelectionSection"
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
            <ChallengeSelectionSection
                eventChallenges={eventChallenges}
                handleChooseChallengeSubmission={handleChooseChallengeSubmission}
                chosenGroupChallenges={chosenGroupChallenges} />
            {chosenGroupChallenges != null &&
                <>
                    <SubmissionBasicInfo register={register} errors={errors} handleGetEmbeddedUrl={handleGetEmbeddedUrl} descriptionValue={descriptionValue} />
                    <FunFactsCreationForm funfacts={funfacts} setFunFacts={setFunFacts} />

                    <div className="flex flex-col gap-4 h-[600px] shadow-xl p-5">
                        <label className="event_input_label">Example Submission Description</label>
                        <ReadOnlyEditor content={EXAMPLE_PROJECT_SUMMANRY} />
                    </div>

                    <div className="shadow-xl/30 inset-shadow-sm rounded-xl w-full">
                        <SimpleEditor initialContent={initialEditorContent} onEditorReady={setEditorValue} limit={STUDENT_SUBMISSION_DESCRIPTION} />
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