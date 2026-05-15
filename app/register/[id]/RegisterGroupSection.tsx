import { RegisterGroupMember } from "@/app/types/group_member"
import { User } from "@supabase/supabase-js"
import { register } from "module"
import { UseFormRegister, FieldErrors } from "react-hook-form"

interface RegisterGroupSectionProps {
    register: UseFormRegister<RegisterGroupMember>,
    errors: FieldErrors<RegisterGroupMember>,
    user: User,
    otherMembers: number[]
}

const RegisterGroupSection = ({ register, errors, user, otherMembers }: RegisterGroupSectionProps) => {
    return (
        <>
            <div className="input-group w-full ">
                <label className="event_input_label ">Group name</label>
                <input autoComplete="off" placeholder="Group name" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                    {...register('title', {
                        required: "Title is required",
                    })} />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="text-lg">Group Members</div>
                <div className="flex flex-col gap-1">
                    <div className="input-group lg:w-1/2 w-full">
                        <span className="event_input_label">Member 1 (You)</span>
                        <input
                            disabled
                            value={user?.email || ""}
                            className="event_input w-full h-[38px] bg-gray-100 cursor-not-allowed opacity-70 font-medium"
                            type="email"
                        />
                    </div>

                    {otherMembers.map((num, index) => (
                        <div className="input-group lg:w-1/2 w-full" key={`member ${num}`}>
                            <span className="event_input_label">Member {num}</span>
                            <input
                                autoComplete="off"
                                placeholder={`Member ${num} email`}
                                className="event_input outline-none w-full h-[38px] placeholder:font-normal"
                                type="email"
                                {...register(`member_emails.${index + 1}`, {
                                    setValueAs: (v: string) => (v.trim() === "" ? null : v.toLowerCase().trim()),
                                    validate: (value, formValues) => {
                                        const isDuplicate = formValues.member_emails.find(

                                            (email: string | null, idx: number) => {
                                                return email === value && idx !== index + 1 && email != null
                                            }
                                        )
                                        if (isDuplicate) {
                                            return "Duplicated email here"
                                        }
                                        return true;
                                    }

                                })}
                            />
                            {errors.member_emails?.[index + 1]?.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.member_emails[index + 1]?.message}
                                </p>
                            )}
                        </div>

                    ))}
                </div>
            </div>
        </>
    )
}

export default RegisterGroupSection