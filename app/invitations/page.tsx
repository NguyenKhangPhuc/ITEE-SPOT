
import { getUser } from "../actions/authentication";
import { getUserInvitations } from "../actions/invitations";
import InvitationClient from "./InvitationsClient";


export default async function Home() {

    const { data, error } = await getUser();
    if (error || data.user == null) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error?.message ? error.message : 'Unknown Error'}</div>;
    }

    const { data: invitations, error: invitationErrpr } = await getUserInvitations(data.user.email!)
    if (invitationErrpr) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {invitationErrpr?.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Your invitations</div>
                <InvitationClient invitations={invitations} user={data.user} />
            </div>
        </div>
    );
}