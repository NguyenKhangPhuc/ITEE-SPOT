'use client'

import { DEGREE, EVENT_STATUS, PROGRAMME } from "@/app/types/enum"
import { Event, EventWithChallenges } from "@/app/types/event"
import { Group, GroupInfo, EventGroups } from "@/app/types/group"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { createClient } from "@/app/utils/supabase/client"
import Image from "next/image";
interface Filter {
    challenges: Array<string>
    programmes: Array<string>,
    degrees: Array<string>
}

const EventGroupsClient = ({ event, eventGroups }: { event: EventWithChallenges, eventGroups: EventGroups }) => {
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
        console.log(data)
        return data.publicUrl;
    }
    const onSubmit = (data: Filter) => {
        console.log(data)
        if (data.challenges.length == 0 && data.degrees.length == 0 && data.programmes.length == 0) {
            setGroups(eventGroups)
        } else {
            const filteredGroups = eventGroups?.filter((group) => {
                console.log()
                const matchChallenge = data.challenges.length === 0 ? true :
                    group.group_challenge.some((ele) => data.challenges.includes(ele.event_challenges?.title ?? ""));

                // 2. Logic cho Degrees
                const matchDegree = data.degrees.length === 0 ? true :
                    group.group_members.some((mem) => data.degrees.includes(mem.profiles?.degree ?? ""));

                // 3. Logic cho Programmes
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white w-[100%] max-w-2xl p-6 rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-300"
                    >

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ClearIcon />
                        </button>

                        <h2 className="text-xl font-bold mb-6">Filter</h2>


                        <div className="mb-6">
                            <label className="block font-semibold mb-3 text-gray-700">Challenges</label>
                            <div className="flex flex-wrap gap-4">
                                {event.event_challenges.map((challenge) => (
                                    <div key={challenge.id} className="flex items-center gap-2">
                                        <label className="checkbox_container">
                                            <input
                                                type="checkbox"
                                                value={challenge.title ?? ""}
                                                {...register('challenges')}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span className="text-sm">{challenge.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="my-4 border-gray-100" />


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div>
                                <label className="block font-semibold mb-3 text-gray-700">Programme</label>
                                <div className="space-y-2">
                                    {Object.values(PROGRAMME).map((prog) => (
                                        <div key={prog} className="flex items-start gap-3 w-full">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <label className="checkbox_container">
                                                    <input
                                                        type="checkbox"
                                                        value={prog}
                                                        {...register('programmes')}
                                                    />
                                                    <div className="checkmark"></div>
                                                </label>
                                            </div>
                                            <span className="text-sm break-words">{prog}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Degree Section */}
                            <div>
                                <label className="block font-semibold mb-3 text-gray-700">Degree</label>
                                <div className="space-y-2">
                                    {Object.values(DEGREE).map((uni) => (
                                        <div key={uni} className="flex items-center gap-2">
                                            <label className="checkbox_container">
                                                <input
                                                    type="checkbox"
                                                    value={uni}
                                                    {...register('degrees')}
                                                />
                                                <div className="checkmark"></div>
                                            </label>
                                            <span className="text-sm">{uni}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => handleResetFilter()}
                                className="px-4 py-2 text-sm font-medium text-black hover:opacity-70 border-4 border-black rounded-xl duration-300 cursor-pointer"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-black text-color rounded-lg font-medium hover:bg-black/80 duration-300 cursor-pointer"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {groups?.map((item, index) => (
                <Link
                    href={`/submission/${item.id}/read-only`}
                    key={`groups_event ${index}`}
                    className="cursor-pointer w-full md:p-8 p-2 rounded-[20px] bg-white 
                               hover:shadow-[0px_0px_20px_#bebebe,-0px_-0px_20px_#ffffff]
                               flex flex-col shadow-xl/10 duration-300 "
                >
                    <div className="w-full flex justify-center items-center">
                        <div className=" relative z-10 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800">
                            {item?.poster_path ? (
                                <Image
                                    src={handleGetUrl(item.poster_path)}
                                    alt={`poster_${item.id}`}
                                    fill
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex md:flex-row flex-col md:justify-between justify-center items-center pb-2 ">
                            <div className="flex flex-wrap items-baseline gap-2 ">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {item?.group_name}
                                </h2>
                            </div>
                            <div className="text-xs font-semibold text-gray-600 uppercase flex gap-2">
                                <span>Event Location: {event?.location}</span>
                                <span>•</span>
                                <span className={event?.status === EVENT_STATUS.ONGOING ? 'text-green-600' : 'text-red-500'}>
                                    {event?.status}
                                </span>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-x-4 sm:text-sm md:text-[13px] text-[10px] flex justify-between font-bold mb-2">
                            <div className="flex gap-1">
                                <span className="text-gray-500">Dates:</span>
                                <span>{new Date(event!.start_date!).toLocaleDateString()} - {new Date(event!.end_date!).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-gray-500">Members:</span>
                                <span>{item.group_members.length} members</span>
                            </div>
                        </div>
                        <div className="mt-5 ">
                            <p className="md:text-lg text-sm font-bold">Group member</p>
                            <div className="grid md:grid-cols-4 md:gap-x-4 grid-cols-2 gap-x-1 text-sm font-bold pt-2 pb-2">
                                {item?.group_members.map((member, index) => {
                                    return <div key={`group ${item.id} - member ${member.member_id}`}
                                        className="w-full flex flex-col sm:text-sm md:text-[13px] text-[10px]"
                                    >
                                        <div className="">Member {index + 1}</div>
                                        <div className="opacity-50 sm:text-sm md:text-[13px] text-[10px]">{member.profiles?.full_name && member.profiles.full_name.length != 0 ? member.profiles?.full_name : "Empty full name"}</div>
                                        <div className="opacity-50 sm:text-sm md:text-[13px] text-[10px]">{member.profiles?.email && member.profiles.email.length != 0 ? member.profiles?.email : "Empty email"} </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="md:text-lg text-sm font-bold">Chosen Challenges</p>
                            <div className="grid md:grid-cols-4 md:gap-x-4 grid-cols-2 gap-x-1 text-sm font-bold pt-2 pb-2">
                                {item?.group_challenge.map((challenge, index) => {
                                    return <div key={`group ${item.id} - member ${challenge.challenge_id}`}
                                        className="w-full flex flex-col sm:text-sm md:text-[13px] text-[10px]   "
                                    >
                                        <div className="">{challenge.event_challenges?.company_name}</div>
                                        <div className="opacity-50 sm:text-sm md:text-[13px] text-[10px]">{challenge.event_challenges?.title}</div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="md:text-lg text-sm font-bold">Short Description</p>
                            <p className="opacity-50 sm:text-sm md:text-[13px] text-[10px]">
                                {item?.short_description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, esse cillum..."}
                            </p>
                        </div>


                    </div>



                    <div

                        className="md:w-60 w-full text-center cursor-pointer mt-5 bg-black hover:bg-black/80 text-white p-3 rounded-lg duration-300"
                    >
                        View group submission
                    </div>
                </Link>
            ))}

        </div>
    )
}
export default EventGroupsClient