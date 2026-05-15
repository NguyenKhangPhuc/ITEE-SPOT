'use client'

import { updateEventInfo } from "@/app/actions/events"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventInsert, EventWithChallenges } from "@/app/types/event"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import { useState } from "react"
import { useForm } from "react-hook-form"

const EditEventBasicInfoSection = ({ event, page }: { event: EventWithChallenges, page: 'basic' | 'challenge' | 'criteria' | 'awards' }) => {
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
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleCreateNewEvent = async (event: EventInsert) => {
        event.content = editorValue?.getHTML()
        setIsOpenLoader(true)
        try {
            const localDate = new Date(event.organized_date!);
            const formattedDate = localDate.toISOString();
            const updatedLocalDateEvent = { ...event, organized_date: formattedDate }
            const { data, error } = await updateEventInfo({ event: updatedLocalDateEvent })
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
    if (page != 'basic') {
        return null
    }
    return (
        <form className="flex flex-col content-main-color mt-5 p-5 rounded-xl gap-5 items-start" onSubmit={handleSubmit(handleCreateNewEvent)}>

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

        </form>

    )
}

export default EditEventBasicInfoSection