'use client'
import { User } from "@supabase/supabase-js"
import { InvitationWithGroupsEvent, ArrayInvitationWithGroupsEvent } from "../types/invitation"
import { INVITATION_STATUS } from "../types/enum";
import { acceptInvitation, rejectInvitation } from "../actions/invitations";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";

const InvitationClient = ({ invitations, user }: { invitations: Array<InvitationWithGroupsEvent> | null, user: User }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case INVITATION_STATUS.PENDING: return 'text-yellow-500';
            case INVITATION_STATUS.ACCEPTED: return 'text-green-600';
            case INVITATION_STATUS.REJECTED: return 'text-red-500';
            default: return 'text-gray-600';
        }
    }

    return (
        <div className="w-full mt-5 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invitations?.map((invite) => (
                    <div
                        key={invite.id}
                        className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                        <SingleInvitation invite={invite} user={user} />
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

const SingleInvitation = ({ invite, user }: { invite: InvitationWithGroupsEvent, user: User }) => {
    const [inviationStatus, setInvitationStatus] = useState(invite.invitation_status)
    const { showNotification } = useNotification()
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case INVITATION_STATUS.PENDING: return 'text-yellow-500';
            case INVITATION_STATUS.ACCEPTED: return 'text-green-600';
            case INVITATION_STATUS.REJECTED: return 'text-red-500';
            default: return 'text-gray-600';
        }
    }
    const handleAcceptInvitation = async () => {
        try {
            await acceptInvitation({ invitationId: invite.id, groupId: invite.group_id!, userId: user.id })
            showNotification('Accepting Successfully')
            setInvitationStatus(INVITATION_STATUS.ACCEPTED)

        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleRejectinvitation = async () => {
        try {
            await rejectInvitation({ invitationId: invite.id })
            showNotification('Rejecting Successfully')
            setInvitationStatus(INVITATION_STATUS.REJECTED)

        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xl font-bold text-black uppercase">
                        {invite.groups?.group_name || "Unknown Group"}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 uppercase flex gap-2 items-center">
                        <span>{invite.groups?.events?.location || "Online"}</span>
                        <span>•</span>
                        <span className={getStatusColor(inviationStatus ?? "")}>
                            {inviationStatus}
                        </span>
                    </div>
                </div>

                <div className="text-lg font-normal text-gray-800 tracking-wide">
                    {invite.groups?.events?.title}
                </div>

                <div className="text-[13px] text-gray-500 mb-4 flex flex-col gap-1">
                    <span className="italic font-medium text-gray-400">You are invited to join this group</span>
                    <span className="font-semibold text-gray-700">
                        Event Date: {new Date(invite.groups?.events?.start_date ?? "0/0/0000").toLocaleDateString()} - {new Date(invite.groups?.events?.end_date ?? "0/0/0000").toLocaleDateString()}
                    </span>
                </div>

                {/* Group Short Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {invite.groups?.short_description}
                </p>
            </div>

            {/* Action Buttons: Only show if Pending */}
            {inviationStatus === INVITATION_STATUS.PENDING && (
                <div className="flex flex-wrap items-center gap-4 mt-auto">
                    <button
                        className="transition duration-300 ease-in-out cursor-pointer w-full h-13 bg-black hover:bg-black/80 hover:scale-105 border rounded-[10px] flex items-center justify-center text-white font-bold text-sm"
                        onClick={() => handleAcceptInvitation()}
                    >
                        Accept Invitation
                    </button>

                    <button
                        className="duration-300 cursor-pointer text-black p-5 text-center w-full h-13 border-4 border-black bg-white hover:scale-105 rounded-[10px] flex items-center justify-center font-bold text-sm"
                        onClick={() => handleRejectinvitation()}
                    >
                        Reject
                    </button>
                </div>
            )}
        </>
    )
}

export default InvitationClient