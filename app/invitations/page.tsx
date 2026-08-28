
import { getUser } from "../actions/authentication/get/getUser";
import { getUserInvitations } from "../actions/invitations/get/getUserInvitations";
import { acceptInvitation } from "@/app/actions/invitations/put/acceptInvitation";
import { rejectInvitation } from "@/app/actions/invitations/put/rejectInvitation";
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
        <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
            <div className="max-w-7xl mx-auto flex flex-col">
                <InvitationClient
                    invitations={invitations}
                    user={data.user}
                    actions={{
                        acceptInvitation,
                        rejectInvitation,
                    }}
                />
            </div>
        </div>
    );
}