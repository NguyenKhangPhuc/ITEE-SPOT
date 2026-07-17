import { getAllEvents } from "../actions/events"
import EventsClient from "./EventsClient"
import { EventInsert } from "../types/event"

/**
 * PURPOSE:
 * This is the server entrypoint page for the Events route. It queries all events
 * from the database server-side and forwards them as props to the client-side EventsClient component.
 *
 * CONTEXT/PARENT FILE:
 * Root page for the events module, linking server-side database fetching with client-side interactive rendering.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
const Home = async () => {
  /**
   * BEHAVIORAL MECHANISM:
   * Performs a server-side fetch of events records via `getAllEvents`. The result is safely
   * cast to an array of type `EventInsert` and forwarded to the client-side rendering engine.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * A JSX element rendering the EventsClient component with the fetched database records.
   */
  const { data: events, error } = await getAllEvents()

  if (error) {
    return (
      <div className="w-full flex items-center justify-center text-red-500 py-20">
        Something went wrong: {error.message}
      </div>
    )
  }

  const typedEvents = (events || []) as unknown as EventInsert[]

  return <EventsClient events={typedEvents} />
}

export default Home