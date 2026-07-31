import { getSingleEvent } from "@/app/actions/events/get/getSingleEvent";
import SingleEventClient from "./SingleEventClient";
import { getUser } from "@/app/actions/authentication/get/getUser";
import { getUserProfile } from "@/app/actions/profiles/get/getUserProfile";

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * PURPOSE:
 * Server component that resolves the event ID from the URL, fetches the event record and
 * the currently authenticated user's profile, then delegates rendering to SingleEventClient.
 *
 * CONTEXT/PARENT FILE:
 * Next.js dynamic route at 'app/events/[id]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Dynamic route parameter from Next.js.
 */
export default async function SingleEventPage({ params }: PageProps) {
    const { id } = await params;

    const { data: event, error } = await getSingleEvent(id)
    if (error || !event) {
        return (
            <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
                {error?.message ?? 'Event not found.'}
            </div>
        );
    }

    const { data, error: userError } = await getUser();
    if (userError || !data?.user) {
        return (
            <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
                {userError?.message ?? 'Authentication required.'}
            </div>
        );
    }

    const { data: user, error: userProfileError } = await getUserProfile(data.user.id)
    if (userProfileError || !user) {
        return (
            <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
                {userProfileError?.message ?? 'Profile not found.'}
            </div>
        );
    }

    return <SingleEventClient event={event} user={user} />;
}