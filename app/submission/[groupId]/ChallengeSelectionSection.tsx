import { EventChallenge } from "@/app/types/event_challenges"

interface ChallengeSelectionSectionProps {
    eventChallenges: Array<EventChallenge>
    chosenGroupChallenges: number | null
    handleChooseChallengeSubmission: (index: number) => Promise<void>
}
const ChallengeSelectionSection = ({ eventChallenges, chosenGroupChallenges, handleChooseChallengeSubmission }: ChallengeSelectionSectionProps) => {
    return (
        <div className="flex flex-col gap-4 w-full mt-4">
            <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {eventChallenges.map((challenge, index) => (
                    <div key={challenge.id} className={`rounded-xl group relative cursor-pointer duration-300 ${chosenGroupChallenges == index ? 'shadow-xl/30 translate-y-2' : ''}`
                    } onClick={() => handleChooseChallengeSubmission(index)}>

                        <div className="relative w-full p-5 border rounded-xl peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                            <div className="text-sm w-2/3 font-light">{challenge.company_name}</div>
                            <h4 className="font-bold w-2/3">{challenge.title}</h4>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChallengeSelectionSection