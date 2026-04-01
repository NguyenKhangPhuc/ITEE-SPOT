import Link from "next/link"
import { getAllEvents } from "../actions/events"
import EventsClient from "./EventsClient";

const Home = async () => {
    const { data: events, error } = await getAllEvents();

    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-6xl mx-auto px-6 flex flex-col p-5 ">

                <Link href={'/events/create'} className="create_btn w-40">
                    Create
                </Link>
                <EventsClient events={events ?? []} />
            </div>
        </div>
    )
}

export default Home