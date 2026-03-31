'use client'
import { EVENT_STATUS, PROFILE_ROLE } from "@/app/types/enum";
import { Event } from "@/app/types/event";
import { Profile } from "@/app/types/profile";
import { createClient } from "@/app/utils/supabase/client";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor";
import Image from "next/image";
import Link from "next/link";
const SingleEventClient = ({ event, user }: { event: Event, user: Profile }) => {
    const supabase = createClient()
    // const { showNotification } = useNotification()
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }
    return (
        <div className="xl:mt-0 mt-10 w-full flex flex-col gap-10 content-main-color rounded-xl p-5">
            <div key={event.id} className="relative flex items-center min-h-[100px]">
                <div className="absolute z-10 xl:w-40 xl:h-40 w-35 h-35 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200
                    top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                    xl:top-1/2 xl:left-0 xl:-translate-y-1/2 xl:-translate-x-20">
                    <div className="relative w-full h-full rounded-full 
                                             flex items-center justify-center cursor-pointer bg-gray-800">
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

                <div className="xl:pt-5 pt-20 xl:pl-24 w-full h-full flex flex-col justify-center">
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
            </div>
            <hr className="border-black/30" />
            <div className="w-full h-[600px] shadow-xl/30 p-5">
                <ReadOnlyEditor content={event.content ?? ""} />
            </div>
            <hr className="border-black/30" />
            <div className="flex flex-col gap-3">
                <div className="flex gap-5">
                    {user?.role == PROFILE_ROLE.JUDGES || user?.role == PROFILE_ROLE.ADMIN ?

                        <>
                            <Link href={`/events/${event.id}/groups`} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-1/2 h-13 border-4 border-black bg-white 
                     hover:scale-102 rounded-[10px] flex items-center justify-center ">
                                View all groups
                            </Link>
                            <Link href={`/events/${event.id}/grade`} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-1/2 h-13 border-4 border-black bg-white 
                     hover:scale-102 rounded-[10px] flex items-center justify-center ">
                                Project evaluation and points
                            </Link>
                        </> : <></>}
                </div>
                {user.role == PROFILE_ROLE.ADMIN &&
                    <Link href={`/events/${event.id}/edit`} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-full h-13 border-4 border-black bg-white 
                     hover:scale-102 rounded-[10px] flex items-center justify-center ">
                        Edit Event
                    </Link>}
                <Link href={`/register/${event.id}`} className="transition duration-300 ease-in-out cursor-pointer 
                w-full h-13 bg-black hover:bg-black/80 hover:scale-102 border rounded-[10px] flex items-center justify-center text-white">
                    Register
                </Link>
            </div>
        </div>
    )
}

export default SingleEventClient