import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProfileInsert } from "../types/profile"

interface UserLinkInfoSection {
    register: UseFormRegister<ProfileInsert>,
    errors: FieldErrors<ProfileInsert>
}

const UserLinkInfoSection = ({ register, errors }: UserLinkInfoSection) => {
    return (
        <>
            <div className="flex gap-5 w-full">
                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Your Github</label>
                    <input
                        {...register('github')}
                        className="event_input outline-none w-full h-[40px] bg-gray-100 "
                        type="text"
                        placeholder="Your Github profile"
                    />
                    {errors.github && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.github.message}
                        </p>
                    )}
                </div>
                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Your LinkedIn</label>
                    <input
                        {...register('linkedIn')}
                        className="event_input outline-none w-full h-[40px] bg-gray-100 "
                        type="text"
                        placeholder="Your LinkedIn profile"
                    />
                    {errors.linkedIn && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.linkedIn.message}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default UserLinkInfoSection