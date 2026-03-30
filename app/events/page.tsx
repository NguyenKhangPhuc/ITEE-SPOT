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

                <Link href={'/events/create'} className="create-button w-40 h-10">
                    <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                        ></path>
                    </svg>
                    <span className="text">Create</span>
                    <span className="circle"></span>
                    <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                        ></path>
                    </svg>
                </Link>
                <EventsClient events={events ?? []} />
            </div>
        </div>
    )
}

export default Home