import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Profile, ProfileInsert } from "../types/profile"

interface UserTextInfoSection {
    user: Profile,
    register: UseFormRegister<ProfileInsert>,
    errors: FieldErrors<ProfileInsert>
}

const UserTextInfoSection = ({ user, register, errors }: UserTextInfoSection) => {
    return (
        <>

            <div className="w-full">
                <div className="input-group w-full">
                    <label className="event_input_label block mb-1">Email</label>
                    <input
                        disabled
                        value={user.email ?? ""}
                        className="event_input outline-none w-full h-[40px] bg-gray-100 cursor-not-allowed cursor-not-allowed"
                        type="email"
                    />

                </div>
            </div>
            <div className="flex gap-5 w-full">
                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Full Name</label>
                    <input
                        {...register('full_name')}
                        className="event_input outline-none w-full h-[40px] bg-gray-100 "
                        type="text"
                    />
                    {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.full_name.message}
                        </p>
                    )}
                </div>
                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Company Name</label>
                    <input
                        {...register('company_name')}
                        className="event_input outline-none w-full h-[40px] bg-gray-100"
                        type="text"
                        placeholder="Your company name (optional)"
                    />
                    {errors.company_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.company_name.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-5 w-full">
                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Position Title</label>
                    <input
                        {...register('job_title')}
                        className="event_input outline-none w-full h-[40px] bg-gray-100 "
                        type="text"
                        placeholder="Your position at the company"
                    />
                    {errors.job_title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.job_title.message}
                        </p>
                    )}
                </div>
                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Company Unit</label>
                    <input
                        {...register('company_unit')}
                        className="event_input outline-none w-full h-[40px] bg-gray-100 "
                        type="text"
                        placeholder="Your position unit at the company"
                    />
                    {errors.company_unit && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.company_unit.message}
                        </p>
                    )}
                </div>

            </div>
            <div className="input-group w-full ">
                <label className="event_input_label">About you</label>
                <textarea
                    autoComplete="off"
                    placeholder="Description"
                    className="event_input outline-none w-full placeholder:font-bold h-[80px]"
                    {...register('description')}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>
        </>
    )
}


export default UserTextInfoSection