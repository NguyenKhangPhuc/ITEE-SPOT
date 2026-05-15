'use client'
import { User } from "@supabase/supabase-js"
import { InvitationWithGroupsEvent, ArrayInvitationWithGroupsEvent } from "../types/invitation"
import { INVITATION_STATUS } from "../types/enum";
import { acceptInvitation, rejectInvitation } from "../actions/invitations";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";
import InvitationSection from "./InvitationSection";

const InvitationClient = ({ invitations, user }: { invitations: Array<InvitationWithGroupsEvent> | null, user: User }) => {

    return (
        <div className="w-full mt-5 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invitations?.map((invite) => (
                    <div
                        key={invite.id}
                        className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                        <InvitationSection invite={invite} user={user} />
                    </div>
                ))}


            </div>
            {invitations?.length === 0 && (
                <div className="w-full text-center text-gray-400  rounded-xl">
                    No invitations found.
                </div>
            )}
        </div>
    )
}



export default InvitationClient