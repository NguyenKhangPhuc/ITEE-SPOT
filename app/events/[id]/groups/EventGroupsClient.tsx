'use client'

import { EVENT_STATUS } from "@/app/types/enum"
import { Event } from "@/app/types/event"
import { Group, GroupInfo, EventGroups } from "@/app/types/group"
import Link from "next/link"

const EventGroupsClient = ({ event, eventGroups }: { event: Event, eventGroups: EventGroups }) => {
    return (
        <div className="w-full flex flex-col gap-8 mt-5  min-h-screen">
            {eventGroups?.map((item, index) => (
                <Link
                    href={`/submission/${item.id}/read-only`}
                    key={`groups_event ${index}`}
                    className="cursor-pointer w-full p-8 rounded-[50px] bg-white 
                               hover:shadow-[0px_0px_20px_#bebebe,-0px_-0px_20px_#ffffff]
                               flex flex-col shadow-xl/10 duration-300 "
                >
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1 ">
                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {item?.group_name}
                                </h2>
                            </div>
                            <div className="text-xs font-semibold text-gray-600 uppercase flex gap-2">
                                <span>Event Location: {event.location}</span>
                                <span>•</span>
                                <span className={event.status === EVENT_STATUS.ONGOING ? 'text-green-600' : 'text-red-500'}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 text-sm font-bold mb-2">
                            <div className="flex gap-1">
                                <span className="text-gray-500">Dates:</span>
                                <span>{new Date(event.start_date!).toLocaleDateString()} - {new Date(event.end_date!).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-gray-500">Members:</span>
                                <span>{item.group_members.length} members</span>
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-lg font-bold">Group member</p>
                            <div className="grid grid-cols-4 gap-x-4 text-sm font-bold pt-2 pb-2">
                                {item?.group_members.map((member, index) => {
                                    return <div key={`group ${item.id} - member ${member.member_id}`}
                                        className="w-full flex flex-col"
                                    >
                                        <div className="">Member {index + 1}</div>
                                        <div className="event_input_label">{member.profiles?.full_name}</div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-lg font-bold">Chosen Challenges</p>
                            <div className="grid grid-cols-4 gap-x-4 text-sm font-bold pt-2 pb-2">
                                {item?.group_challenge.map((challenge, index) => {
                                    return <div key={`group ${item.id} - member ${challenge.challenge_id}`}
                                        className="w-full flex flex-col"
                                    >
                                        <div className="">{challenge.event_challenges?.company_name}</div>
                                        <div className="event_input_label">{challenge.event_challenges?.title}</div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="mt-1">
                            <p className="text-lg font-bold">Short Description</p>
                            <p className="text-sm text-gray-800 line-clamp-2 leading-tight">
                                {item?.short_description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, esse cillum..."}
                            </p>
                        </div>


                    </div>



                    <div

                        className="max-w-1/3 text-center cursor-pointer mt-5 bg-black hover:bg-black/80 text-white p-3 rounded-lg duration-300"
                    >
                        See their submission
                    </div>
                </Link>

            ))}

        </div>
    )
}
export default EventGroupsClient