'use client'
import Link from "next/link";
import { EVENT_STATUS } from "../types/enum";
import { Event } from "../types/event";
import Image from "next/image";
import { createClient } from "../utils/supabase/client";
import EventClient from "./Event";

const EventsClient = ({ events }: { events: Array<Event> }) => {
    const supabase = createClient()
    // const { showNotification } = useNotification()
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }
    return (
        <div className=" w-full flex flex-col gap-10 mt-10 pb-10">
            {events.map((event) => (
                <div key={event.id}>
                    <EventClient event={event} handleGetUrl={handleGetUrl} />
                </div>
            ))}
        </div>
    );
};

export default EventsClient;