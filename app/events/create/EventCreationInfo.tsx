'use client'
import { Database } from "@/app/types/database.types";
import { EventInsert } from "@/app/types/event";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface EventCreationProps {
    register: UseFormRegister<EventInsert>
    errors: FieldErrors<EventInsert>
}

const EventCreationInfo = ({ register, errors }: EventCreationProps) => {
    return (
        <>
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
        </>
    )
}


export default EventCreationInfo