'use client'

import { updateGroupName } from "@/app/actions/groups"
import { sendInvitations } from "@/app/actions/invitations"
import { useNotification } from "@/app/context/NotificationContext"
import { INVITATION_STATUS } from "@/app/types/enum"
import { GroupInfo } from "@/app/types/group"
import { InvitationInsert } from "@/app/types/invitation"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const SingleGroupClient = ({ groupInfo, currentUser }: { groupInfo: GroupInfo, currentUser: User }) => {

    const [disableGroupName, setDisableGroupName] = useState(true);
    const { showNotification } = useNotification()
    const {
        register: registerGroupName,
        handleSubmit: handleSubmitGroupName,
        formState: { errors: groupNameErros },
        reset: resetGroupName,
    } = useForm({
        defaultValues: {
            groupName: groupInfo?.group_name ?? ""
        }
    })

    const {
        register: registerMemberInvitation,
        handleSubmit: handleSubmitUserEmail,
        formState: { errors }
    } = useForm<InvitationInsert>({
        defaultValues: {
            member_email: "",
            group_id: groupInfo?.id,
            invitation_status: INVITATION_STATUS.PENDING,
        }
    })

    const handleSaveGroupName = async (data: { groupName: string }) => {
        if (disableGroupName == true) {
            setDisableGroupName(false)
        } else {
            try {
                const updatedGroupInfo = await updateGroupName({ groupId: groupInfo!.id, groupName: data.groupName })
                showNotification("Update group name successfully")
                resetGroupName({ groupName: updatedGroupInfo?.group_name ?? "" })
                setDisableGroupName(true)
            } catch (error) {
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        }
    }

    const handleSendInvitation = async (data: InvitationInsert) => {
        if (groupInfo?.group_members.length == groupInfo?.events?.max_group_members) {
            showNotification(`Reach maximum ${groupInfo?.events?.max_group_members} members per group`)
        } else {
            try {
                await sendInvitations(data)
                showNotification('Send invitation successfully')
            } catch (error) {
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        }
    }

    return (
        <div className="w-full flex flex-col mt-5 gap-5 shadow-xl/30 p-5 rounded-xl">
            <form className="w-full flex gap-3 " onSubmit={handleSubmitGroupName(handleSaveGroupName)}>
                <div className="input-group w-full">
                    <label className="event_input_label">Your group name</label>
                    <div className="w-full flex items-center gap-5">
                        <input placeholder="Project title" className={`event_input outline-none w-full h-[40px] font-bold ${disableGroupName ? 'cursor-not-allowed opacity-70' : ''}`} type="text"
                            disabled={disableGroupName}
                            {...registerGroupName('groupName', {
                                required: "Group name is required",
                            })} />
                        <button className={`bg-black px-10 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                            type="submit"
                        >
                            {disableGroupName ? 'Edit' : 'Save'}
                        </button>
                    </div>
                    {groupNameErros.groupName && (
                        <p className="text-red-500 text-sm mt-1">
                            {groupNameErros.groupName.message}
                        </p>
                    )}
                </div>

            </form>

            <form className="w-full flex flex-col gap-5" onSubmit={handleSubmitUserEmail(handleSendInvitation)}>

                <div className="w-full flex-col">
                    <div className="text-lg font-bold">Group Members</div>
                    {groupInfo?.group_members.map((member, index) => (
                        <div className="input-group w-1/2" key={`member ${member.id}`}>
                            <span className="event_input_label">Member {index + 1}</span>
                            <input
                                disabled
                                value={member.profiles?.email || ""}
                                className="event_input w-full h-[40px] bg-gray-100 cursor-not-allowed opacity-70 font-medium"
                                type="email"
                            />
                        </div>
                    ))}
                </div>

                <div className="w-full flex-col">
                    <div className="text-lg font-bold">Invite your group member</div>
                    <label className="event_input_label">New member email</label>
                    <div className="w-full flex items-center gap-5">
                        <input placeholder="New member email" className={`event_input outline-none w-full h-[40px] font-bold opacity-70 `} type="text"

                            {...registerMemberInvitation('member_email', {
                                required: "Member email is required",
                            })} />
                        <button className={`bg-black px-10 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                            type="submit"
                        >
                            Invite
                        </button>
                    </div>
                    {errors.member_email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.member_email.message}
                        </p>
                    )}
                </div>
            </form>

            <Link href={`/submission/${groupInfo?.id}`}
                className={`flex gap-5 justify-center items-center bg-black max-w-[350px] px-10 py-2 text-center rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300 mt-5`}
                type="submit"
            >
                Your group submission
                <ArrowForwardIcon sx={{ color: 'white' }} />
            </Link>
        </div>
    )
}

export default SingleGroupClient