
import { getUser } from "../actions/authentication/get/getUser";
import { getUserProfile } from "../actions/profiles";
import UserProfileClient from "./UserProfileClient";


export default async function Home() {

    const { data, error } = await getUser();
    if (error || data.user == null) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error?.message ? error.message : 'Unknown Error'}</div>;
    }

    const { data: user, error: userError } = await getUserProfile(data.user!.id)
    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userError?.message}</div>;
    }
    return (
        <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
            <div className="max-w-7xl mx-auto flex flex-col">
                <UserProfileClient user={user!} />
            </div>
        </div>
    );
}