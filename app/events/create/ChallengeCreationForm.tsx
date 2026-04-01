'use client'
import { EventChallengeInsert } from "@/app/types/event_challenges";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';


const ChallengeCreationForm = ({ challenges, setChallenges }: { challenges: Array<EventChallengeInsert>, setChallenges: React.Dispatch<SetStateAction<Array<EventChallengeInsert>>> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EventChallengeInsert>()


    const handleCreateNewChallenge = (challenge: EventChallengeInsert) => {
        setChallenges([...challenges, challenge])
        reset({
            company_name: "",
            title: ""
        });
    }
    const handleDeleteChallenge = (index: number) => {
        setChallenges(prev => prev.filter((_, i) => i !== index))
    }


    return (
        <div className="flex w-full flex-col gap-2">
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
            {challenges.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                    {challenges.map((challenge, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-md"
                        >
                            <span className="font-semibold">{challenge.title}</span>

                            <button
                                type="button"
                                onClick={() => handleDeleteChallenge(index)}
                                className="cursor-pointer hover:text-red-500"
                            >
                                <ClearIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button
                className="cursor-pointer w-50 py-2 rounded-md bg-black hover:bg-black/90 transition-colors duration-300 text-white"
                onClick={handleSubmit(handleCreateNewChallenge)}
                type="button"
            >
                Add challenge
            </button>
        </div>

    )
}

export default ChallengeCreationForm