'use client'

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
import { updateGroupNameAndDescription, updateGroupPosterPath } from "@/app/actions/groups"
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image"
import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants"
import { useWatch } from "react-hook-form";
import { createClient } from "@/app/utils/supabase/client"
const SingleGroupClient = ({ groupInfo, currentUser }: { groupInfo: GroupInfo, currentUser: User }) => {
    const supabase = createClient()
    const [disableGroupName, setDisableGroupName] = useState(true);
    const { showNotification } = useNotification()
    const handleGetInitialImage = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        console.log(data)
        return data.publicUrl;
    }
    const [previewUrl, setPreviewUrl] = useState(groupInfo?.poster_path ? handleGetInitialImage(groupInfo.poster_path!) : null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const {
        register: registerGroup,
        handleSubmit: handleSubmitGroupName,
        formState: { errors: groupErrors },
        reset: resetGroupName,
        control
    } = useForm({
        defaultValues: {
            groupName: groupInfo?.group_name ?? "",
            short_description: groupInfo?.short_description ?? "",
        }
    })
    const descriptionValue = useWatch({
        control: control,
        name: "short_description",
        defaultValue: ""
    });

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
                const updatedGroupInfo = await updateGroupNameAndDescription({ groupId: groupInfo!.id, groupName: data.groupName, description: data.short_description })
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
    const handleFileChange = (file: File) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setAvatarFile(file)
        }
    };

    const handleRemoveAvatarFile = () => {
        setPreviewUrl(null)
        setAvatarFile(null)
    }

    const handleUpdateImage = async () => {
        try {
            await updateGroupPosterPath({ groupId: groupInfo!.id, avatarFile, originalPath: groupInfo?.poster_path ?? null })
            showNotification('Update successfully')
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    return (
        <div className="w-full flex flex-col mt-5 gap-5 content-main-color shadow-xl/30 p-5 rounded-xl">
            <form className="w-full flex-col gap-3 " onSubmit={handleSubmitGroupName(handleSaveGroupName)}>
                <div className="w-full flex flex-col items-center gap-5">
                    <div className="relative w-40 h-40 group">
                        <div className="relative w-full h-full rounded-full border-2 border-dashed border-gray-500 
                        flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition-all duration-300 bg-gray-50">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Avatar"
                                    width={200}
                                    height={200}
                                    sizes="200px"

                                    className="object-cover rounded-full "
                                />
                            ) : (
                                <div className="text-center p-2 text-xs text-gray-500 font-medium">
                                    Pick an image to show
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        handleFileChange(files[0]);
                                    }
                                }}
                            />
                        </div>
                        {previewUrl && (
                            <button
                                onClick={() => handleRemoveAvatarFile()}
                                className="w-5 h-5 flex items-center justify-center absolute top-3 right-3 bg-black text-white rounded-full shadow-lg 
                                                 transition-colors z-20 cursor-pointer hover:bg-black/70 duration-300"
                                type="button"
                            >
                                <ClearIcon sx={{ fontSize: 16, color: 'white' }} />
                            </button>
                        )}

                    </div>
                    <button className={`bg-black px-5 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                        type="button" onClick={() => handleUpdateImage()}
                    >
                        Save image
                    </button>
                </div>
                <div className="w-full flex gap-3 ">
                    <div className="input-group w-full">
                        <label className="event_input_label">Your group name</label>
                        <div className="w-full flex items-center gap-5">
                            <input placeholder="Project title" className={`event_input outline-none w-full h-[40px] font-bold ${disableGroupName ? 'cursor-not-allowed opacity-70' : ''}`} type="text"
                                disabled={disableGroupName}
                                {...registerGroup('groupName', {
                                    required: "Group name is required",
                                })} />
                        </div>
                        {groupErrors.groupName && (
                            <p className="text-red-500 text-sm mt-1">
                                {groupErrors.groupName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="input-group w-full ">
                    <label className="event_input_label">Short Description</label>
                    <textarea
                        maxLength={SHORT_DESCRIPTION_LENGTH}
                        disabled={disableGroupName}
                        autoComplete="off"
                        placeholder="Short Description -- Max 200 characters"
                        className={`event_input outline-none w-full placeholder:font-bold h-[80px] ${disableGroupName ? 'cursor-not-allowed opacity-70' : ''}`}
                        {...registerGroup('short_description', {
                            required: "Short description members is required",
                        })}
                    />
                    <div className="w-full flex justify-between">

                        {groupErrors.short_description && (
                            <p className="text-red-500 text-sm mt-1">
                                {groupErrors.short_description.message}
                            </p>
                        )}
                        <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '14px' }}>
                            <span style={{ color: descriptionValue.length >= SHORT_DESCRIPTION_LENGTH ? 'red' : 'gray' }}>
                                {descriptionValue.length}
                            </span>
                            /{SHORT_DESCRIPTION_LENGTH} Characters
                        </div>
                    </div>
                </div>
                {disableGroupName == true && <button className={`bg-black px-10 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                    type="button" onClick={() => setDisableGroupName(false)}
                >
                    Edit
                </button>}
                {disableGroupName == false && <button className={`bg-black px-10 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                    type="submit"
                >
                    Save
                </button>}
            </form>

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