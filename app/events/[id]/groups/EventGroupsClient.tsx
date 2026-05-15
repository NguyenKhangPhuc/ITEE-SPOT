'use client'

import { DEGREE, EVENT_STATUS, PROGRAMME } from "@/app/types/enum"
import { Event, EventWithChallenges } from "@/app/types/event"
import { Group, GroupInfo, EventGroups, Filter } from "@/app/types/group"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { createClient } from "@/app/utils/supabase/client"
import Image from "next/image";
import FilterComponent from "./FilterComponent"
import EventGroup from "./Group"


const EventGroupsClient = ({ event, eventGroups }: { event: EventWithChallenges, eventGroups: Array<EventGroups> | null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groups, setGroups] = useState(eventGroups)
    const supabase = createClient()
    const { register, handleSubmit, reset } = useForm<Filter>({
        defaultValues: {
            challenges: [],
            programmes: [],
            degrees: [],
        }
    });
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }
    const onSubmit = (data: Filter) => {
        if (data.challenges.length == 0 && data.degrees.length == 0 && data.programmes.length == 0) {
            setGroups(eventGroups)
        } else {
            const filteredGroups = eventGroups?.filter((group) => {
                const matchChallenge = data.challenges.length === 0 ? true :
                    group.group_challenge.some((ele) => data.challenges.includes(ele.event_challenges?.title ?? ""));


                const matchDegree = data.degrees.length === 0 ? true :
                    group.group_members.some((mem) => data.degrees.includes(mem.profiles?.degree ?? ""));


                const matchProgramme = data.programmes.length === 0 ? true :
                    group.group_members.some((mem) => data.programmes.includes(mem.profiles?.programme ?? ""));

                return matchChallenge && matchDegree && matchProgramme;
            }) ?? []

            setGroups(filteredGroups)

        }
        setIsOpen(false);
    };

    const handleResetFilter = () => {
        reset()
        setGroups(eventGroups)
        setIsOpen(false)
    }
    return (
        <div className="w-full flex flex-col gap-8 mt-5  min-h-screen">
            <button
                onClick={() => setIsOpen(true)}
                className="w-40 h-10 bg-black text-white border-4 border-white rounded-xl 
                cursor-pointer hover:bg-white hover:text-black duration-300 flex gap-5 items-center justify-center font-bold"
            >
                Filter
                <FilterAltIcon />
            </button>
            {isOpen && (
                <div className="fixed min-h-screen inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm max-h-[600px]">
                    <FilterComponent setIsOpen={setIsOpen}
                        handleSubmit={handleSubmit}
                        event={event}
                        onSubmit={onSubmit}
                        handleResetFilter={handleResetFilter}
                        register={register} />
                </div>)}
            {groups?.map((item, index) => (
                <div key={`groups_event ${index}`}>
                    <EventGroup handleGetUrl={handleGetUrl} item={item} event={event} />
                </div>
            ))}

        </div>
    )
}
export default EventGroupsClient