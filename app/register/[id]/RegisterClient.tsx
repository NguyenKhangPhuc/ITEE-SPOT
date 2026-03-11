'use client'

import { insertGroupMembers } from "@/app/actions/group_member"
import { useNotification } from "@/app/context/NotificationContext"
import { Event } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { RegisterGroupMember } from "@/app/types/group_member"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

const RegisterClient = ({ event, user, challenges }: { event: Event, user: User, challenges: Array<EventChallengeInsert> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterGroupMember>({
        defaultValues: {
            title: "",
            member_emails: [user.email],
            challenges: [],
            event_id: event.id,
            user_id: user.id,
        }
    });

    const router = useRouter()

    const { showNotification } = useNotification()
    const otherMembers = Array.from(
        { length: (event.max_group_members || 1) - 1 },
        (_, i) => i + 2
    );

    const handleCreateGroup = async (data: RegisterGroupMember) => {

        try {
            const { createdGroup } = await insertGroupMembers(data)
            showNotification('Create group successfully')
            router.push(`/groups/${createdGroup.id}`)
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <form className="w-full h-auto flex flex-col gap-5 p-5 shadow-xl/30 mt-5" onSubmit={handleSubmit(handleCreateGroup)} >
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
                    <div className="input-group w-1/2">
                        <span className="event_input_label">Member 1 (You)</span>
                        <input
                            disabled
                            value={user?.email || ""}
                            className="event_input w-full h-[38px] bg-gray-100 cursor-not-allowed opacity-70 font-medium"
                            type="email"
                        />
                    </div>

                    {otherMembers.map((num, index) => (
                        <div className="input-group w-1/2" key={`member ${num}`}>
                            <span className="event_input_label">Member {num}</span>
                            <input
                                autoComplete="off"
                                placeholder={`Member ${num} email`}
                                className="event_input outline-none w-full h-[38px] placeholder:font-normal"
                                type="email"
                                {...register(`member_emails.${index + 1}`, {
                                    setValueAs: (v: string) => (v.trim() === "" ? null : v.trim()),
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
                            {errors.member_emails?.[index + 1] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.member_emails?.[index + 1].message}
                                </p>
                            )}
                        </div>

                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full mt-4">
                <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
                <div className="grid grid-cols-2 gap-4">
                    {challenges.map((challenge) => (
                        <div key={challenge.id} className="group relative cursor-pointer">

                            <div className="relative w-full p-5 border rounded-xl peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                                <div className="text-sm w-2/3 font-light">{challenge.company_name}</div>
                                <h4 className="font-bold w-2/3">{challenge.title}</h4>

                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <label className="checkbox_container">
                                        <input type="checkbox" value={challenge.id}

                                            {...register('challenges')} />
                                        <div className="checkmark"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="cursor-pointer mt-10 bg-black hover:bg-black/80 text-white p-3 rounded-lg duration-300" >
                Register Now
            </button>
        </form>
    )
}

export default RegisterClient