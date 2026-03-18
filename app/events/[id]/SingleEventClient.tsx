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
        console.log(data)
        return data.publicUrl;
    }
    return (
        <div className="w-full flex flex-col gap-10 content-main-color rounded-xl p-5">
            <div key={event.id} className="relative flex items-center h-40">
                <div className="-translate-x-20 absolute left-0 z-10 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                    {event.poster_path ? (
                        <Image
                            src={handleGetUrl(event.poster_path)}
                            alt={`poster_${event.id}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold">
                            No Image
                        </div>
                    )}
                </div>

                <div className="w-full h-full flex flex-col justify-center pl-24 py-4 ">
                    <div className="flex justify-between items-start mb-1 ">
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

                    <div className="grid grid-cols-2 gap-x-4 text-sm font-bold mb-2">
                        <div className="flex gap-1">
                            <span className="text-gray-500">Dates:</span>
                            <span>{new Date(event.start_date!).toLocaleDateString()} - {new Date(event.end_date!).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-gray-500">Max/Group:</span>
                            <span>{event.max_group_members} members</span>
                        </div>
                    </div>

                    <div className="mt-1">
                        <p className="text-sm font-bold">Short Description</p>
                        <p className="text-sm text-gray-800  leading-tight">
                            {event.short_description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, esse cillum..."}
                        </p>
                    </div>
                </div>
            </div>


            <hr className="border-black/30" />

            <div className="flex flex-col gap-4 mb-10">
                <ReadOnlyEditor content={event.content!} />
            </div>
            <hr className="border-black/30" />
            <div className="flex gap-5">
                <Link href={`/register/${event.id}`} className="transition duration-300 ease-in-out cursor-pointer 
                w-40 h-13 bg-black hover:bg-black/80 hover:scale-105 border rounded-[10px] flex items-center justify-center text-white">
                    Register
                </Link>
                {user?.role == PROFILE_ROLE.JUDGES || user?.role == PROFILE_ROLE.ADMIN &&

                    <Link href={`/events/${event.id}/groups`} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-60 h-13 border-4 border-black bg-white hover:bg-black
                     hover:scale-105 rounded-[10px] flex items-center justify-center ">
                        View all groups
                    </Link>}
            </div>
        </div>
    )
}

export default SingleEventClient