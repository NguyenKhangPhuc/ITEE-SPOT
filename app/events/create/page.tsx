/**
 * PURPOSE:
 * Server Component representing the Create Event page wrapper.
 * It mounts and renders the client-side CreateEventClient component.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/create/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import CreateEventClient from "./CreateEventClient"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <CreateEventClient />
      </div>
    </div>
  )
}