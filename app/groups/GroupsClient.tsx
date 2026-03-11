
import Link from "next/link"
import { GroupEvents } from "./page"
import { EVENT_STATUS } from "../types/enum"

const GroupsClient = ({ groupsWithEvents }: { groupsWithEvents: GroupEvents }) => {
    return (
        <div className="w-full flex flex-col gap-8 mt-5  min-h-screen">
            {groupsWithEvents?.map((item, index) => (
                <Link
                    href={`/groups/${item.group_id}`}
                    key={`groups_event ${index}`}
                    className="cursor-pointer w-full p-8 rounded-[50px] bg-white 
                               shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]
                               flex flex-col hover:shadow-xl/10 duration-300 "
                >
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1 ">
                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {item.groups?.group_name}
                                </h2>
                                <span className="text-gray-500">—</span>
                                <h3 className="text-lg text-gray-600 italic">
                                    {item.groups?.events?.title}
                                </h3>
                            </div>
                            <div className="text-xs font-semibold text-gray-600 uppercase flex gap-2">
                                <span>{item.groups?.events?.location}</span>
                                <span>•</span>
                                <span className={item.groups?.events?.status === EVENT_STATUS.ONGOING ? 'text-green-600' : 'text-red-500'}>
                                    {item.groups?.events?.status}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 text-sm font-bold mb-2">
                            <div className="flex gap-1">
                                <span className="text-gray-500">Dates:</span>
                                <span>{new Date(item.groups!.events!.start_date!).toLocaleDateString()} - {new Date(item.groups!.events!.end_date!).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-gray-500">Max/Group:</span>
                                <span>{item.groups?.events?.max_group_members} members</span>
                            </div>
                        </div>

                        <div className="mt-1">
                            <p className="text-sm font-bold">Event Short Description</p>
                            <p className="text-sm text-gray-800 line-clamp-2 leading-tight">
                                {item.groups?.events?.short_description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, esse cillum..."}
                            </p>
                        </div>


                    </div>



                    <div

                        className="max-w-1/3 text-center cursor-pointer mt-5 bg-black hover:bg-black/80 text-white p-3 rounded-lg duration-300"
                    >
                        Navigate to group
                    </div>
                </Link>

            ))}

        </div>
    )
}

export default GroupsClient