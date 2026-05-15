'use client'

import { insertGroupMembers } from "@/app/actions/group_member"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { Event } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { RegisterGroupMember } from "@/app/types/group_member"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import RegisterGroupSection from "./RegisterGroupSection"
import RegisterChallengeSection from "./RegisterChallengeSection"

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
    const { setIsOpenLoader } = useLoader()
    const router = useRouter()

    const { showNotification } = useNotification()
    const otherMembers = Array.from(
        { length: (event.max_group_members || 1) - 1 },
        (_, i) => i + 2
    );

    const handleCreateGroup = async (data: RegisterGroupMember) => {
        setIsOpenLoader(true)
        try {
            const { createdGroup, error } = await insertGroupMembers(data)
            if (error) {
                throw new Error(error)
            }
            if (!createdGroup) {
                throw new Error("Failed to load created group")
            }
            setIsOpenLoader(false)
            showNotification('Create group successfully')
            router.push(`/groups/${createdGroup.id}`)
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }

    return (
        <form className="w-full h-auto flex flex-col gap-5 p-5 shadow-xl/30 mt-5 content-main-color" onSubmit={handleSubmit(handleCreateGroup)} >
            <RegisterGroupSection register={register} errors={errors} user={user} otherMembers={otherMembers} />
            <RegisterChallengeSection register={register} errors={errors} challenges={challenges} />
            <button type="submit" className="cursor-pointer mt-10 bg-black hover:bg-black/80 text-white p-3 rounded-lg duration-300" >
                Register Now
            </button>
        </form>
    )
}

export default RegisterClient