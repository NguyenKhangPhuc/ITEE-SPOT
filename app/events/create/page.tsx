'use client'
import { createEvent } from "@/app/actions/events"
import { useNotification } from "@/app/context/NotificationContext"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import { useRouter } from "next/navigation"
import React, { ChangeEvent, SetStateAction, useState } from "react"
import { CriteriaMode, useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import { Event, EventInsert } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import Image from "next/image"
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import ChallengeCreationForm from "./ChallengeCreationForm"
import EventCreationInfo from "./EventCreationInfo"
import { EventCriteria, EventCriteriaInsert } from "@/app/types/event_criteria"


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
            const { data, error } = await createEvent({ event, challenges, avatarFile, criteria })
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
            <div className="max-w-4xl mx-auto px-6 pt-5 pb-5">
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


const CriteriaCreation = ({ criteria, setCriteria }: { criteria: Array<EventCriteriaInsert>, setCriteria: React.Dispatch<SetStateAction<Array<EventCriteriaInsert>>> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EventCriteriaInsert>()

    const handleAddingCriteria = (newCriteria: EventCriteriaInsert) => {
        setCriteria([...criteria, newCriteria])
        reset()
    }

    const handleDeleteCriteria = (receivedIndex: number) => {
        const updatedCriteriaLists = criteria.filter((cri, index) => {
            return index != receivedIndex
        })
        setCriteria(updatedCriteriaLists)
    }
    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex flex-col gap-2">
                <div className="flex w-full gap-4">
                    <div className="input-group w-2/3">
                        <label className="event_input_label">Criteria Name</label>
                        <input
                            autoComplete="off"
                            placeholder="e.g. Code Quality"
                            className="event_input outline-none w-full h-[40px] placeholder:font-bold"
                            type="text"
                            {...register('criteria_name', { required: "Name is required" })}
                        />
                        {errors.criteria_name && <p className="text-red-500 text-sm mt-1">{errors.criteria_name.message}</p>}
                    </div>

                    <div className="input-group w-1/3">
                        <label className="event_input_label">Percentage (%)</label>
                        <input
                            autoComplete="off"
                            placeholder="1-100"
                            className="event_input outline-none w-full h-[40px] placeholder:font-bold"
                            type="number"
                            {...register('percentage', {
                                required: "Required",
                                min: { value: 1, message: "Min 1" },
                                max: { value: 100, message: "Max 100" }
                            })}
                        />
                        {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage.message}</p>}
                    </div>
                </div>

                {/* Row 2: Description (Full width) */}
                <div className="input-group w-full">
                    <label className="event_input_label">Description</label>
                    <textarea
                        autoComplete="off"
                        placeholder="Describe this criteria..."
                        className="event_input outline-none w-full placeholder:font-bold h-[80px] py-2"
                        {...register('criteria_description', { required: "Description is required" })}
                    />
                    {errors.criteria_description && <p className="text-red-500 text-sm mt-1">{errors.criteria_description.message}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-5">
                {criteria.map((item, index) => (
                    <div
                        key={item.id}
                        className="relative p-5 rounded-xl bg-white border border-gray-100 shadow-xl/30 transition-all duration-300 hover:-translate-y-2 h-70"
                    >

                        <button
                            type="button"
                            onClick={() => handleDeleteCriteria(index)}
                            className="absolute top-1 right-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <ClearIcon />
                        </button>

                        {/* Header: Name & Percentage */}
                        <div className="flex justify-between items-center mb-1 pr-6">
                            <h4 className="font-bold text-lg truncate">{item.criteria_name}</h4>
                            <span className="text-green-500 font-bold shrink-0">
                                {item.percentage}%
                            </span>
                        </div>


                        <p className="text-sm text-gray-600 line-clamp-10">
                            {item.criteria_description || "No description provided."}
                        </p>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={handleSubmit(handleAddingCriteria)}
                className="cursor-pointer w-60 py-2 rounded-md bg-black hover:bg-black/80 transition-colors duration-300 text-white"
            >
                Add grading criteria
            </button>
        </div>
    )
}

export default Home