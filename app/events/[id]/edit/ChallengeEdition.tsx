import { updateEventChallenges } from "@/app/actions/events"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { useState } from "react"

const ChallengeEdition = ({ receivedChallenge }: { receivedChallenge: EventChallengeInsert }) => {
    const { showNotification } = useNotification()

    const [challenge, setChallenge] = useState<EventChallengeInsert>(receivedChallenge)
    const { setIsOpenLoader } = useLoader()
    const handleUpdateChallenge = async () => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await updateEventChallenges({ eventChallenge: challenge })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification('Update successfully')
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }
    return (
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-x-4  items-center w-full">
            <div className="input-group w-full">
                <label className="event_input_label">Company</label>
                <input autoComplete="off" placeholder="Company name" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"
                    value={challenge.company_name ?? ""}
                    onChange={(e) => setChallenge({ ...challenge, company_name: e.target.value })}
                />

            </div>
            <div className="input-group w-full">
                <label className="event_input_label">Title</label>
                <input autoComplete="off" placeholder="Challenge title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"
                    value={challenge.title ?? ""}
                    onChange={(e) => setChallenge({ ...challenge, title: e.target.value })}
                />
            </div>
            <div className="input-group w-full">
                <label className="event_input_label">Save</label>
                <button
                    type="button"
                    onClick={() => handleUpdateChallenge()}
                    className=" flex items-center justify-center bg-black hover:bg-black/80 duration-300 text-color h-[40px] rounded-xl w-full cursor-pointer"
                >
                    Save
                </button>
            </div>

        </div>
    )
}

export default ChallengeEdition