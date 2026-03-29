import { getSingleEvent } from "@/app/actions/events";
import SingleEventClient from "./SingleEventClient";
import { getUser } from "@/app/actions/authentication";
import { getUserProfile } from "@/app/actions/profiles";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: event, error } = await getSingleEvent(id)
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error.message}</div>;
    }
    const { data, error: ussrError } = await getUser();
    if (error || data.user == null) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {ussrError?.message ? ussrError.message : 'Unknown Error'}</div>;
    }

    const { data: user, error: userProfileError } = await getUserProfile(data.user!.id)
    if (userProfileError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userProfileError?.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5 ">
                <SingleEventClient event={event!} user={user!} />
            </div>
        </div>
    );
}