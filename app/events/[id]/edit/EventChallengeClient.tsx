import { createEventChallenge } from "@/app/actions/event_challenges"
import { updateEventChallenges } from "@/app/actions/events"
import { useNotification } from "@/app/context/NotificationContext"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import ChallengeEdition from "./ChallengeEdition"

const ChallengeCreationForm = ({ challenges, setChallenges, event }: {
    challenges: Array<EventChallengeInsert>,
    setChallenges: React.Dispatch<SetStateAction<Array<EventChallengeInsert>>>, event: EventChallengeInsert
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EventChallengeInsert>()
    const { showNotification } = useNotification()

    const handleCreateNewChallenge = async (challenge: EventChallengeInsert) => {

        try {
            if (!event.id) {
                throw new Error('Fail to create event challenge')
            }
            challenge.event_id = event.id
            const { data, error } = await createEventChallenge(challenge)
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch new challenge")
            }
            setChallenges([...challenges, data])
            reset({
                company_name: "",
                title: ""
            });

            showNotification('Create successfully')
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }


    return (
        <>
            <div className="w-full flex gap-5">
                <div className="input-group w-1/2">
                    <label className="event_input_label">Company</label>
                    <input autoComplete="off" placeholder="Company name" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                        {...register('company_name', {
                            required: "Company name for challenge is required",
                        })} />
                    {errors.company_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.company_name.message}
                        </p>
                    )}
                </div>
                <div className="input-group w-1/2">
                    <label className="event_input_label">Title</label>
                    <input autoComplete="off" placeholder="Challenge title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                        {...register('title', {
                            required: "Challenge title is required",
                        })} />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>
            </div>
            <button
                className="cursor-pointer px-6 py-2 rounded-md bg-black hover:bg-black/90 transition-colors duration-300 text-white"
                onClick={handleSubmit(handleCreateNewChallenge)}
                type="button"
            >
                Create challenge
            </button>
            {challenges.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                    {challenges.map((challenge, index) => (
                        <div
                            key={index}
                            className="w-full"
                        >
                            <ChallengeEdition receivedChallenge={challenge} />
                        </div>
                    ))}
                </div>
            )}

        </>

    )
}




export default ChallengeCreationForm