
'use client'
import Link from "next/link"
import { EVENT_STATUS } from "../types/enum"
import { EventGroups, GroupEvents, UserGroupsWithEvent } from "../types/group"
import Image from "next/image";
import { createClient } from "../utils/supabase/client";
const GroupsClient = ({ groupsWithEvents }: { groupsWithEvents: UserGroupsWithEvent }) => {
    const supabase = createClient()
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        console.log(data)
        return data.publicUrl;
    }
    console.log(groupsWithEvents)
    return (
        <div className="w-full flex flex-col gap-8 mt-5  min-h-screen">
            {groupsWithEvents?.map((item, index) => (
                <Link
                    href={`/groups/${item.id}`}
                    key={`groups_event ${index}`}
                    className="cursor-pointer w-full md:p-8 p-2 rounded-[20px] bg-white 
                               hover:shadow-[0px_0px_20px_#bebebe,-0px_-0px_20px_#ffffff]
                               flex flex-col shadow-xl/10 duration-300 "
                >
                    <div className="w-full flex justify-center items-center">
                        <div className=" relative z-10 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
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
                                <span>Event Location: {item.events?.location}</span>
                                <span>•</span>
                                <span className={item.events?.status === EVENT_STATUS.ONGOING ? 'text-green-600' : 'text-red-500'}>
                                    {item.events?.status}
                                </span>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-x-4 sm:text-sm md:text-[13px] text-[10px] flex justify-between font-bold mb-2">
                            <div className="flex gap-1">
                                <span className="text-gray-500">Dates:</span>
                                <span>{new Date(item.events!.start_date!).toLocaleDateString()} - {new Date(item.events!.end_date!).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-gray-500">Members:</span>
                                <span>{item.group_members.length} members</span>
                            </div>
                        </div>
                        <div className="mt-5 ">
                            <p className="md:text-lg text-sm font-bold">Group member</p>
                            <div className="grid md:grid-cols-4 md:gap-x-4 grid-cols-2 gap-x-1 text-sm font-bold pt-2 pb-2">
                                {item?.all_members.map((member, index) => {
                                    return <div key={`group ${item.id} - member ${member.member_id}`}
                                        className="w-full flex flex-col sm:text-sm md:text-[13px] text-[10px]"
                                    >
                                        <div className="">Member {index + 1}</div>
                                        <div className="opacity-50 sm:text-sm md:text-[13px] text-[10px]">{member.profiles?.full_name}</div>
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

                        className="md:w-50 w-full text-center cursor-pointer mt-5 bg-black hover:bg-black/80 text-white p-3 rounded-lg duration-300"
                    >
                        View your group
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default GroupsClient