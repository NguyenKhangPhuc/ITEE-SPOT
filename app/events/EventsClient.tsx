import Link from "next/link";
import { EVENT_STATUS } from "../types/enum";
import { Event } from "../types/event";
import Image from "next/image";

const EventsClient = ({ events }: { events: Array<Event> }) => {

    return (
        <div className="w-full flex flex-col gap-10 pt-10 pb-10 ">
            {events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}
                    className="cursor-pointer relative flex items-center h-40 rounded-[40px] shadow-xl/30 hover:shadow-xl duration-300 hover:translate-y-1">
                    <div className="-translate-x-20 absolute left-0 z-10 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                        {event.poster_path ? (
                            <Image
                                src={event.poster_path}
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

                    <div className="w-full h-full border border-black rounded-[40px]  flex flex-col justify-center pl-24 pr-10 py-4">
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
                            <p className="text-sm text-gray-800 line-clamp-2 leading-tight">
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