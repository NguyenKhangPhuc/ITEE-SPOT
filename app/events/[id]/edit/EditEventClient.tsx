'use client'
import { Event, EventInsert, EventWithChallenges } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import ChallengeCreationForm from "./EventChallengeClient"
import { useLoader } from "@/app/context/LoaderContext"
import EventCriteriaEdit from "./EventCriteriaEdit"
import EventPosterSection from "./EventPosterSection"
import { useState } from "react"
import EditEventBasicInfoSection from "./EditEventBasicInfoSection"


const EditEventClient = ({ event }: { event: EventWithChallenges }) => {
    const [challenges, setChallenges] = useState<Array<EventChallengeInsert>>(event.event_challenges)
    const [currentPage, setCurrentPage] = useState<'basic' | 'challenge' | 'criteria' | 'awards'>('basic')
    return (
        <div className="w-full bg-white rounded-xl p-5 flex flex-col gap-3">
            <div className="w-full flex gap-5">
                <button className={`duration-300 cursor-pointer ${currentPage == 'basic' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${currentPage == 'basic' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => setCurrentPage('basic')}
                >
                    Edit Basic Info
                </button>
                <button className={`duration-300 cursor-pointer ${currentPage == 'challenge' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${currentPage == 'challenge' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => setCurrentPage('challenge')}
                >
                    Edit Challenge
                </button>
            </div>
            <div className="w-full flex gap-5 pb-10">
                <button className={`duration-300 cursor-pointer ${currentPage == 'criteria' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${currentPage == 'criteria' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => setCurrentPage('criteria')}
                >
                    Edit Criteria
                </button>
                <button className={`duration-300 cursor-pointer ${currentPage == 'awards' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${currentPage == 'awards' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => setCurrentPage('awards')}
                >
                    Edit Awards
                </button>
            </div>
            <EventPosterSection event={event} />
            <EditEventBasicInfoSection page={currentPage} event={event} />
            <ChallengeCreationForm page={currentPage} challenges={challenges} setChallenges={setChallenges} event={event} />
            <EventCriteriaEdit receivedCriteria={event.event_grading_criteria ?? []} eventId={event.id} page={currentPage} />

        </div>
    )
}


export default EditEventClient