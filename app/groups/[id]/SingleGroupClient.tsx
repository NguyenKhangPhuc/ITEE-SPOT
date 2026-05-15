'use client'

import { sendInvitations } from "@/app/actions/invitations"
import { useNotification } from "@/app/context/NotificationContext"
import { INVITATION_STATUS } from "@/app/types/enum"
import { EditGroupInfo, GroupInfo } from "@/app/types/group"
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
import { useLoader } from "@/app/context/LoaderContext"
import GroupAvatar from "./GroupAvatar"
import GroupInfoSection from "./GroupInfo"
import GroupMemberSection from "./GroupMemberSection"
const SingleGroupClient = ({ groupInfo, currentUser }: { groupInfo: GroupInfo, currentUser: User }) => {
    const supabase = createClient()
    const [disableGroupName, setDisableGroupName] = useState(true);
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleGetInitialImage = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);

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
    } = useForm<EditGroupInfo>({
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



    const handleSaveGroupName = async (data: EditGroupInfo) => {
        setIsOpenLoader(true)
        if (disableGroupName == true) {
            setDisableGroupName(false)
        } else {
            try {
                const { data: updatedGroupInfo, error } = await updateGroupNameAndDescription({ groupId: groupInfo!.id, groupName: data.groupName, description: data.short_description })
                if (error) {
                    throw new Error(error)
                }

                resetGroupName({ groupName: updatedGroupInfo?.group_name ?? "" })
                setDisableGroupName(true)
                setIsOpenLoader(false)
                showNotification("Update group name successfully")
            } catch (error) {
                if (error instanceof Error) {
                    showNotification(error.message)
                }
                setIsOpenLoader(false)
            }
        }
    }

    const handleSendInvitation = async (invitationInfo: InvitationInsert) => {
        setIsOpenLoader(true)
        if (groupInfo?.group_members.length == groupInfo?.events?.max_group_members) {
            showNotification(`Reach maximum ${groupInfo?.events?.max_group_members} members per group`)
        } else {
            try {
                const updatedInvitation = { ...invitationInfo, member_email: invitationInfo.member_email?.toLowerCase().trim() }
                const { data, error } = await sendInvitations(updatedInvitation)
                if (error) {
                    throw new Error(error)
                }
                setIsOpenLoader(false)
                showNotification('Send invitation successfully')
            } catch (error) {

                if (error instanceof Error) {
                    showNotification(error.message)
                }
                setIsOpenLoader(false)
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
        setIsOpenLoader(true)
        try {
            const { data, error } = await updateGroupPosterPath({ groupId: groupInfo!.id, avatarFile, originalPath: groupInfo?.poster_path ?? null })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification('Update successfully')
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    return (
        <div className="w-full flex flex-col mt-5 gap-5 content-main-color shadow-xl/30 p-5 rounded-xl">
            <form className="w-full flex-col gap-3 " onSubmit={handleSubmitGroupName(handleSaveGroupName)}>
                <GroupAvatar
                    previewUrl={previewUrl}
                    handleFileChange={handleFileChange}
                    handleRemoveAvatarFile={handleRemoveAvatarFile}
                    handleUpdateImage={handleUpdateImage}
                />
                <GroupInfoSection
                    registerGroup={registerGroup}
                    disableGroupName={disableGroupName}
                    groupErrors={groupErrors}
                    descriptionValue={descriptionValue}
                    setDisableGroupName={setDisableGroupName}
                />
            </form>

            <GroupMemberSection
                groupInfo={groupInfo}
                handleSendInvitation={handleSendInvitation}
            />

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