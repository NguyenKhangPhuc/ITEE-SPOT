'use client'
import { INVITATION_STATUS } from "@/app/types/enum"
import { GroupInfo } from "@/app/types/group"
import { InvitationInsert } from "@/app/types/invitation"
import { useForm } from "react-hook-form"

interface GroupMemberSectionProps {
    groupInfo: GroupInfo,
    handleSendInvitation: (invitationInfo: InvitationInsert) => Promise<void>
}

const GroupMemberSection = ({ groupInfo, handleSendInvitation }: GroupMemberSectionProps) => {
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
    return (
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmitUserEmail(handleSendInvitation)}>

            <div className="w-full flex-col">
                <div className="text-lg font-bold">Group Members</div>
                {groupInfo?.group_members.map((member, index) => (
                    <div className="input-group md:w-1/2 w-full" key={`member ${member.id}`}>
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
                <div className="w-full flex md:flex-row flex-col md:items-center items-start gap-5">
                    <input placeholder="New member email" className={`event_input outline-none w-full h-[40px] font-bold opacity-70 `} type="text"

                        {...registerMemberInvitation('member_email', {
                            required: "Member email is required",
                            setValueAs: (v: string) => (v.trim() === "" ? null : v.toLowerCase().trim())
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
    )
}

export default GroupMemberSection