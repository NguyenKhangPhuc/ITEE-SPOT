'use client'
import Link from "next/link";
import { EVENT_STATUS } from "../types/enum";
import { Event } from "../types/event";
import Image from "next/image";
import { createClient } from "../utils/supabase/client";

const EventsClient = ({ events }: { events: Array<Event> }) => {
    const supabase = createClient()
    // const { showNotification } = useNotification()
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        console.log(data)
        return data.publicUrl;
    }
    return (
        <div className=" w-full flex flex-col gap-10 mt-10 pb-10">
            {events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}
                    className="xl:mt-0 mt-15 cursor-pointer relative flex items-center h-auto rounded-[40px] duration-300 hover:translate-y-1">

                    <div className="absolute z-10 xl:w-40 xl:h-40 w-35 h-35 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200
                    top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                    xl:top-1/2 xl:left-0 xl:-translate-y-1/2 xl:-translate-x-20"
                    >
                        <div className="relative w-full h-full rounded-full 
                         flex items-center justify-center cursor-pointer ">
                            {event.poster_path ? (
                                <Image
                                    src={handleGetUrl(event.poster_path)}
                                    alt="Avatar"
                                    width={200}
                                    height={200}
                                    sizes="200px"
                                    className="object-cover rounded-full "
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold">
                                    No Image
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="xl:pt-5 pt-20 xl:pl-24 pl-5 w-full h-full border border-black rounded-[40px]  flex flex-col justify-center pr-5 py-4 content-main-color
                      shadow-xl/30 hover:shadow-[0px_0px_20px_#bebebe,-0px_-0px_20px_#ffffff] duration-300">
                        <div className="flex lg:flex-row flex-col sm:w-auto w-full sm:justify-between justify-center items-center mb-2 ">
                            <h2 className="text-xl font-black uppercase tracking-tight leading-none">
                                {event.title}
                            </h2>

                            <div className="text-xs font-semibold text-gray-600 uppercase flex gap-2">
                                <span>{event.location}</span>
                                <span>•</span>
                                <span className={event.status === EVENT_STATUS.ONGOING ? 'text-green-600' : 'text-red-500'}>
                                    {event.status}
                                </span>
                            </div>
                        </div>

                        <div className="w-full lg:grid grid-cols-2 gap-x-4 flex sm:flex-row text-sm font-bold mb-2 flex-col items-center justify-center">
                            <div className="flex gap-1">
                                <span className="text-gray-500">Dates:</span>
                                <span className="">{new Date(event.start_date!).toLocaleDateString()} - {new Date(event.end_date!).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-gray-500">Max/Group:</span>
                                <span className="">{event.max_group_members} members</span>
                            </div>
                        </div>


                        <div className="w-full lg:grid grid-cols-2 gap-x-4 flex sm:flex-row text-sm font-bold mb-2 flex-col items-center justify-center">
                            <div className="flex gap-1">
                                <span className="text-gray-500">Organized Date:</span>
                                <span>{new Date(event.organized_date!).toLocaleDateString()}</span>
                            </div>
                            <div className=" flex gap-1">
                                <span className="text-gray-500">Organized Date:</span>
                                <span>{new Date(event.organized_date!).toLocaleTimeString()}</span>
                            </div>
                        </div>

                        <div className="w-full mt-1 flex flex-col  lg:items-start justify-center items-center">
                            <p className="text-sm font-bold">Short Description</p>
                            <p className="text-sm text-gray-800 line-clamp-2 leading-tight w-full lg:text-start text-center">
                                {event.short_description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, esse cillum..."}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default EventsClient;