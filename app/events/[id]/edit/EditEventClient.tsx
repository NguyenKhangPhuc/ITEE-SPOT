'use client'
import { createEvent, updateEventChallenges, updateEventInfo, updateEventPoster } from "@/app/actions/events"
import { useNotification } from "@/app/context/NotificationContext"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import { useRouter } from "next/navigation"
import { ChangeEvent, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import { Event, EventInsert, EventWithChallenges } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import Image from "next/image"
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { createClient } from "@/app/utils/supabase/client"
import { createEventChallenge } from "@/app/actions/event_challenges"
import ChallengeCreationForm from "./EventChallengeClient"
import { useLoader } from "@/app/context/LoaderContext"
import EventCriteriaEdit from "./EventCriteriaEdit"


const EditEventClient = ({ event }: { event: EventWithChallenges }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm<EventInsert>({
        defaultValues: {
            ...event, organized_date: new Date(event.organized_date ?? "")
                .toISOString()
                .slice(0, 16)
        }
    })

    const router = useRouter()
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const supabase = createClient()
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const [challenges, setChallenges] = useState<Array<EventChallengeInsert>>(event.event_challenges)
    const handleGetInitialImage = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }
    const [previewUrl, setPreviewUrl] = useState(event.poster_path ? handleGetInitialImage(event.poster_path!) : null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const handleCreateNewEvent = async (event: EventInsert) => {
        event.content = editorValue?.getHTML()
        setIsOpenLoader(true)
        try {
            const { data, error } = await updateEventInfo({ event })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification("Update event successfully")
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
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setAvatarFile(file)
        }
    };

    const handleRemoveAvatarFile = () => {
        setPreviewUrl(null)
        setAvatarFile(null)
    }

    const handleUpdateImage = async () => {
        setIsOpenLoader(true)
        try {
            const { error } = await updateEventPoster({ eventId: event.id, posterFile: avatarFile, originalPath: event.poster_path })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification("Update image successfully")
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-6xl mx-auto px-6 pt-5 pb-5">
                <form className="flex flex-col content-main-color mt-5 p-5 rounded-xl gap-5 items-start" onSubmit={handleSubmit(handleCreateNewEvent)}>
                    <div className="w-full flex flex-col items-center gap-3">
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
                        <button className={`bg-black px-5 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                            type="button" onClick={() => handleUpdateImage()}
                        >
                            Save image
                        </button>
                    </div>


                    <div className="w-full flex gap-5">
                        <div className="input-group w-full">
                            <label className="event_input_label">Title</label>
                            <input autoComplete="off" placeholder="Project title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                                {...register('title', {
                                    required: "Title is required",
                                })} />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 w-full">
                        <div className="input-group w-full">
                            <label className="event_input_label">Start Date</label>
                            <input autoComplete="off" placeholder="Start Date" id="StartDate"
                                className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="date"
                                {...register('start_date', {
                                    required: "Start date is required",
                                })}
                            />
                            {errors.start_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.start_date.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group w-full">
                            <label className="event_input_label">End Date</label>
                            <input autoComplete="off" id="EndDate" placeholder="End Date" className="event_input outline-none w-full  h-[40px] placeholder:font-bold" type="date"
                                {...register('end_date', {
                                    required: "End date is required",
                                })}
                            />
                            {errors.end_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.end_date.message}
                                </p>
                            )}
                        </div>

                        <div className="input-group w-full">
                            <label className="event_input_label">Location</label>
                            <input autoComplete="off" placeholder="Location" id="Location" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"
                                {...register('location', {
                                    required: "Location is required",
                                })}
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.location.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group w-full">
                            <label className="event_input_label">Organized Date</label>
                            <input autoComplete="off" id="OrganizedDate"
                                placeholder="Organized Date" className="event_input outline-none w-full  h-[40px] placeholder:font-bold" type="datetime-local"
                                {...register('organized_date', {
                                    required: "Organized Date is required",
                                })}
                            />
                            {errors.organized_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.organized_date.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="input-group w-full">
                        <label className="event_input_label">Max member per teams</label>
                        <input autoComplete="off" min="1"
                            step="1"
                            id="MaxMember"
                            placeholder="Max member per teams"
                            className="event_input outline-none w-[80px]  h-[40px] placeholder:font-bold"
                            type="number"
                            {...register('max_group_members', {
                                required: "Max group members is required",
                            })}
                        />
                        {errors.max_group_members && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.max_group_members.message}
                            </p>
                        )}
                    </div>

                    <div className="input-group w-full ">
                        <label className="event_input_label">Short Description</label>
                        <textarea
                            autoComplete="off"
                            placeholder="Short Description"
                            className="event_input outline-none w-full placeholder:font-bold h-[80px]"
                            {...register('short_description', {
                                required: "Short description members is required",
                            })}
                        />
                        {errors.short_description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.short_description.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full shadow-xl/30 inset-shadow-sm rounded-xl ">
                        <SimpleEditor initialContent={event.content} onEditorReady={setEditorValue} limit={EVENT_CREATED_DESCRIPTION} />
                    </div>
                    <button
                        type="submit"
                        className="cursor-pointer w-full py-2 rounded-md  hover:scale-102 border-4 border-black transition-colors duration-300 text-black"
                    >
                        Save
                    </button>
                    <ChallengeCreationForm challenges={challenges} setChallenges={setChallenges} event={event} />
                    <EventCriteriaEdit receivedCriteria={event.event_grading_criteria ?? []} eventId={event.id} />
                </form>
            </div>
        </div>
    )
}


export default EditEventClient