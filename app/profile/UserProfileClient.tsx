'use client'
import { updateProfile } from "../actions/profiles"
import { useNotification } from "../context/NotificationContext"
import { DEGREE, PROGRAMME, UNIVERSITY, YEAR } from "../types/enum"
import { Profile, ProfileInsert } from "../types/profile"
import { useForm } from "react-hook-form"

const UserProfileClient = ({ user }: { user: Profile }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProfileInsert>({
        defaultValues: user
    })

    const { showNotification } = useNotification()

    const onSubmit = async (data: ProfileInsert) => {
        try {
            const updatedValue = await updateProfile({ profile: data })
            if (updatedValue) {
                reset(updatedValue)
                showNotification('Update Successfully')
            } else {
                showNotification('Fail to update the profile')
            }
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    return (
        <div className="w-full p-5 mt-5 content-main-color rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">

                <div className="w-full">
                    <div className="input-group w-full">
                        <label className="event_input_label block mb-1">Email</label>
                        <input
                            disabled
                            value={user.email || ""}
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
                        <label className="event_input_label block mb-1">Company Name (Optional)</label>
                        <input
                            {...register('company_name')}
                            className="event_input outline-none w-full h-[40px] bg-gray-100 opacity-70"
                            type="text"
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
                        <label className="event_input_label block mb-1">University</label>
                        <select
                            {...register('university')}
                            className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2"
                        >
                            <option value="">Pick an option</option>
                            {Object.values(UNIVERSITY).map((uni) => (
                                <option key={uni} value={uni}>{uni}</option>
                            ))}
                        </select>
                        {errors.university && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.university.message}
                            </p>
                        )}
                    </div>

                    <div className="input-group w-1/2">
                        <label className="event_input_label block mb-1">Programme</label>
                        <select
                            {...register('programme')}
                            className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2"
                        >
                            <option value="">Pick an option</option>
                            {Object.values(PROGRAMME).map((prog) => (
                                <option key={prog} value={prog}>{prog}</option>
                            ))}
                        </select>
                        {errors.programme && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.programme.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-5 w-full">
                    <div className="input-group w-1/2">
                        <label className="event_input_label block mb-1">Your Degree</label>
                        <select
                            {...register('degree')}
                            className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2"
                        >
                            <option value="">Pick an option</option>
                            {Object.values(DEGREE).map((uni) => (
                                <option key={uni} value={uni}>{uni}</option>
                            ))}
                        </select>
                        {errors.university && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.university.message}
                            </p>
                        )}
                    </div>

                    <div className="input-group w-1/2">
                        <label className="event_input_label block mb-1">You&apos;re in year</label>
                        <select
                            {...register('year')}
                            className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2"
                        >
                            <option value="">Pick an option</option>
                            {Object.values(YEAR).map((prog) => (
                                <option key={prog} value={prog}>{prog}</option>
                            ))}
                        </select>
                        {errors.programme && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.programme.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="w-full pt-4">
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black/80 transition-colors duration-300"
                    >
                        Save profile
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserProfileClient