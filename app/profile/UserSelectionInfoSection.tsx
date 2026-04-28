import { register } from "module"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { UNIVERSITY, PROGRAMME, DEGREE, YEAR } from "../types/enum"
import { Profile, ProfileInsert } from "../types/profile"

interface UserSelectionInfoSection {
    register: UseFormRegister<ProfileInsert>,
    errors: FieldErrors<ProfileInsert>
}


const UserSelectionInfoSection = ({ register, errors }: UserSelectionInfoSection) => {
    return (
        <>
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
        </>
    )
}

export default UserSelectionInfoSection