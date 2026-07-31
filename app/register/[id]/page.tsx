import { getUser } from "@/app/actions/authentication/get/getUser";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import RegisterClient from "./RegisterClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * PURPOSE:
 * Server component that resolves the event ID from the URL, fetches the event record,
 * the authenticated user, and the list of event challenges, then delegates rendering
 * to RegisterClient.
 *
 * CONTEXT/PARENT FILE:
 * Next.js dynamic route at 'app/register/[id]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Dynamic route parameter from Next.js.
 */
export default async function RegisterPage({ params }: PageProps) {
    const { id } = await params;

    const { data: event, error } = await getSingleEvent(id)
    if (error || !event) {
        return (
            <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
                {error?.message ?? "Event not found."}
            </div>
        );
    }

    const { data, error: userError } = await getUser()
    if (userError || !data?.user) {
        return (
            <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
                {userError?.message ?? "Authentication required."}
            </div>
        );
    }

    const { data: challenges, error: challengesError } = await getEventChallenges(id)
    if (challengesError) {
        return (
            <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
                {challengesError.message}
            </div>
        );
    }

    return (
        <RegisterClient
            event={event}
            user={data.user}
            challenges={challenges ?? []}
        />
    );
}