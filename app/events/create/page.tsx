'use client'
import { createEvent } from "@/app/actions/events"
import { useNotification } from "@/app/context/NotificationContext"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import { EventInsert } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import Image from "next/image"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import ChallengeCreationForm from "./ChallengeCreationForm"
import EventCreationInfo from "./EventCreationInfo"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import CriteriaCreation from "./EventCriteria"

const Home = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm<EventInsert>()

    const router = useRouter()
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const [challenges, setChallenges] = useState<Array<EventChallengeInsert>>([])
    const [criteria, setCriteria] = useState<Array<EventCriteriaInsert>>([])
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const handleCreateNewEvent = async (event: EventInsert) => {
        event.content = editorValue?.getHTML()
        setIsOpenLoader(true)
        try {
            const localDate = new Date(event.organized_date!);
            const formattedDate = localDate.toISOString();
            const updatedLocalDateEvent = { ...event, organized_date: formattedDate }
            const { data, error } = await createEvent({ event: updatedLocalDateEvent, challenges, avatarFile, criteria })
            if (error) {
                throw new Error(error)
            }
            if (data == null) {
                throw new Error('Cannot find created event')
            }
            setIsOpenLoader(false)
            showNotification("Create event successfully")
            router.push(`/events/${data.id}`)
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            } else {
                showNotification("Unknown error when create the event")
            }
            setIsOpenLoader(false)
        }
    }
    const handleFileChange = (file: File) => {
        if (file) {
            // Tạo Blob URL cho file vừa chọn
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setAvatarFile(file)
        }
    };

    const handleRemoveAvatarFile = () => {
        setPreviewUrl(null)
        setAvatarFile(null)
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 pt-5 pb-5">
                <form className="flex flex-col content-main-color mt-5 p-5 rounded-xl gap-5 items-start" onSubmit={handleSubmit(handleCreateNewEvent)}>
                    <div className="w-full flex flex-col items-center">
                        <div className="relative w-40 h-40 group">
                            <div className="relative w-full h-full rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition-all duration-300 bg-gray-50">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Avatar"
                                        width={200}
                                        height={200}
                                        sizes="200px"

                                        className="object-cover rounded-full "
                                    />
                                ) : (
                                    <div className="text-center p-2 text-xs text-gray-500 font-medium">
                                        Pick an image to show
                                    </div>
                                )}

                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            handleFileChange(files[0]);
                                        }
                                    }}
                                />
                            </div>

                            {previewUrl && (
                                <button
                                    onClick={() => handleRemoveAvatarFile()}
                                    className="w-5 h-5 flex items-center justify-center absolute top-3 right-3 bg-black text-white rounded-full shadow-lg 
                                 transition-colors z-20 cursor-pointer hover:bg-black/70 duration-300"
                                    type="button"
                                >
                                    <ClearIcon sx={{ fontSize: 16, color: 'white' }} />
                                </button>
                            )}
                        </div>
                    </div>



                    <EventCreationInfo register={register} errors={errors} />

                    <div className="w-full shadow-xl/30 inset-shadow-sm rounded-xl ">
                        <SimpleEditor initialContent={null} onEditorReady={setEditorValue} limit={EVENT_CREATED_DESCRIPTION} />
                    </div>
                    <ChallengeCreationForm challenges={challenges} setChallenges={setChallenges} />
                    <CriteriaCreation criteria={criteria} setCriteria={setCriteria} />

                    <button
                        type="submit"
                        className="cursor-pointer w-full px-6 py-2 rounded-md bg-black hover:bg-black/80 transition-colors duration-300 text-white"
                    >
                        Create New
                    </button>
                </form>
            </div>
        </div>
    )
}



export default Home