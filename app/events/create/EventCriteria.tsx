'use client'
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { SetStateAction } from "react"
import { useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
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

export default CriteriaCreation