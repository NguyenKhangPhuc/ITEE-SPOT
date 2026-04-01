'use client'

import { createEventCriteria, updateEventCriteria } from "@/app/actions/event_criteria"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { CRITERIA_TYPE } from "@/app/types/enum"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { useState } from "react"
import { useForm } from "react-hook-form"

const EventCriteriaEdit = ({ receivedCriteria, eventId }: { receivedCriteria: Array<EventCriteriaInsert>, eventId: string }) => {
    const [criteria, setCriteria] = useState(receivedCriteria)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EventCriteriaInsert>()


    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleAddingCriteria = async (newCriteria: EventCriteriaInsert) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await createEventCriteria({ newCriteria, eventId })
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch new created criteria")
            }
            setIsOpenLoader(false)
            showNotification("Create the criteria successfully")
            setCriteria([...criteria, data])
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }

    const handleChoseEventCriteria = (existedCriteria: EventCriteriaInsert) => {
        reset(existedCriteria)
    }

    const handleSaveCriteria = async (existedCriteria: EventCriteriaInsert) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await updateEventCriteria({ updatedCriteria: existedCriteria })
            if (error) {
                throw new Error(error)
            }
            const updatedCriteria = criteria.map((ele) => {
                if (ele.id == existedCriteria.id) {
                    return existedCriteria
                }
                return ele
            })
            setCriteria(updatedCriteria)
            setIsOpenLoader(false)
            showNotification("Update criteria successfully")
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }

        }
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
            <div className="input-group w-full">
                <label className="event_input_label">Criteria Type</label>
                <select
                    {...register('type', { required: "Type is required" })}
                    className="event_input outline-none w-full placeholder:font-bold h-[40px] py-2"
                >
                    <option value="" disabled>
                        Choose an option
                    </option>

                    <option value={CRITERIA_TYPE.NORMAL}>Normal</option>
                    <option value={CRITERIA_TYPE.SPECIFIC}>Specific</option>

                </select>
            </div>
            <div className="flex gap-5 mt-5">
                <button
                    type="button"
                    onClick={handleSubmit(handleSaveCriteria)}
                    className="cursor-pointer w-1/2 py-2 rounded-md  hover:scale-102 border-4 border-black transition-colors duration-300 text-black"
                >
                    Save criteria
                </button>
                <button
                    type="button"
                    onClick={handleSubmit(handleAddingCriteria)}
                    className="cursor-pointer w-1/2 py-2 rounded-md  hover:scale-102 border-4 border-black transition-colors duration-300 text-black"
                >
                    Add grading criteria
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-5">
                {criteria.map((item, index) => (
                    <div
                        key={item.id}
                        className="cursor-pointer relative p-5 rounded-xl bg-white border border-gray-100 shadow-xl/30 transition-all duration-300 hover:-translate-y-2 h-70"
                        onClick={() => handleChoseEventCriteria(item)}
                    >


                        <div className="flex justify-between items-center mb-1 pr-6">
                            <h4 className="font-bold text-lg truncate">{item.criteria_name}
                                <div className="text-sm opacity-50">Type: {item.type}</div>
                            </h4>
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

        </div>
    )
}

export default EventCriteriaEdit