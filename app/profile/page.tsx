
import { getUser } from "../actions/authentication";
import { getUserProfile } from "../actions/profiles";
import UserProfileClient from "./UserProfileClient";


export default async function Home() {

    const { data, error } = await getUser();
    if (error || data.user == null) {
        return <div className="w-full flex items-center justify-center text-red-500">Đã có lỗi xảy ra: {error?.message ? error.message : 'Unknown Error'}</div>;
    }

    const { data: user, error: userError } = await getUserProfile(data.user!.id)
    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Đã có lỗi xảy ra: {userError?.message}</div>;
    }
    console.log(user, data)
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Your profile</div>
                <UserProfileClient user={user!} />
            </div>
        </div>
    );
}