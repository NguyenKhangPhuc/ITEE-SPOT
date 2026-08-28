'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/utils/supabase/client"
import { useNotification } from "@/app/context/NotificationContext"
import { useLoader } from "@/app/context/LoaderContext"
import { updateGroupNameAndDescription } from "@/app/actions/groups/put/updateGroupNameAndDescription"
import { updateGroupPosterPath } from "@/app/actions/groups/put/updateGroupPosterPath"
import { sendInvitations } from "@/app/actions/invitations/post/sendInvitations"
import { removeStudentsThemselveFromGroupById } from "@/app/actions/group_member/delete/removeStudentsThemselveFromGroupById"
import { EditGroupInfo, GroupInfo } from "@/app/types/group"
import { InvitationInsert } from "@/app/types/invitation"
import { User } from "@supabase/supabase-js"
import BackButton from "@/app/components/BackButton"
import GroupIdentitySection from "./components/GroupIdentitySection"
import GroupMemberArray from "./components/GroupMemberArray"
import InviteSequence from "./components/InviteSequence"
import GroupActionButtons from "./components/GroupActionButtons"
import { tw } from "@/app/constants/design-tokens"
import { motion } from "framer-motion"

interface SingleGroupClientProps {
  groupInfo: GroupInfo
  currentUser: User
  pendingInvitations: InvitationInsert[]
}

/**
 * PURPOSE:
 * This component acts as the primary client-side orchestrator for the single group detail
 * configuration page. It initializes the forms and callbacks to update group details (name,
 * description, poster path), invite new group members, and perform self-exclusion from the group.
 * It coordinates sub-components in a responsive two-column grid.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/groups/[id]/page.tsx'. Sub-components reside in
 * 'app/groups/[id]/components/'.
 *
 * INPUTS / PARAMETERS:
 * - groupInfo (GroupInfo, Required): Detailed metadata of the group, including members.
 * - currentUser (User, Required): The authenticated user's session record.
 * - pendingInvitations (InvitationInsert[], Required): List of pending invitations.
 */
export default function SingleGroupClient({
  groupInfo,
  currentUser,
  pendingInvitations,
}: SingleGroupClientProps) {
  const supabase = createClient()
  const router = useRouter()
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  /**
   * BEHAVIORAL MECHANISM:
   * Generates public URLs for uploaded media files in Supabase storage attachments bucket.
   *
   * PARAMETERS:
   * - imagePath (string): Storage path for the poster asset.
   *
   * RETURNS:
   * - string: Fully qualified public asset URL.
   */
  const handleGetInitialImage = (imagePath: string): string => {
    const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath)
    return data.publicUrl
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    groupInfo?.poster_path ? handleGetInitialImage(groupInfo.poster_path) : null
  )

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroupName,
    formState: { errors: groupErrors },
    reset: resetGroupName,
    control,
  } = useForm<EditGroupInfo>({
    defaultValues: {
      groupName: groupInfo?.group_name ?? "",
      short_description: groupInfo?.short_description ?? "",
    },
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Saves updated group metadata (name and description) to the database by calling the
   * updateGroupNameAndDescription server action.
   *
   * PARAMETERS:
   * - data (EditGroupInfo): Validated form data.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveGroupName = async (data: EditGroupInfo) => {
    setIsOpenLoader(true)
    try {
      const { data: updatedGroupInfo, error } = await updateGroupNameAndDescription({
        groupId: groupInfo!.id,
        groupName: data.groupName,
        description: data.short_description,
      })
      if (error) throw new Error(error)

      resetGroupName({
        groupName: updatedGroupInfo?.group_name ?? "",
        short_description: updatedGroupInfo?.short_description ?? "",
      })
      setIsOpenLoader(false)
      showNotification("Update group name successfully")
    } catch (error) {
      if (error instanceof Error) showNotification(error.message)
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Validates and dispatches team invitation email payloads to the sendInvitations server action.
   *
   * PARAMETERS:
   * - invitationInfo (InvitationInsert): Form values containing the target node email.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSendInvitation = async (invitationInfo: InvitationInsert) => {
    setIsOpenLoader(true)
    const maxCapacity = groupInfo?.events?.max_group_members ?? 1
    const activeCount = (groupInfo?.group_members.length ?? 0) + pendingInvitations.length

    if (activeCount >= maxCapacity) {
      showNotification(`Reach maximum ${maxCapacity} members per group`)
      setIsOpenLoader(false)
    } else {
      try {
        const updatedInvitation = {
          ...invitationInfo,
          member_email: invitationInfo.member_email?.toLowerCase().trim(),
        }
        const { error } = await sendInvitations(updatedInvitation)
        if (error) throw new Error(error)
        setIsOpenLoader(false)
        showNotification("Send invitation successfully")
        router.refresh()
      } catch (error) {
        if (error instanceof Error) showNotification(error.message)
        setIsOpenLoader(false)
      }
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Sets up a local object URL to display a preview of the selected image file.
   *
   * PARAMETERS:
   * - file (File): The file object selected by the user.
   *
   * RETURNS:
   * - void
   */
  const handleFileChange = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setAvatarFile(file)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Resets the local image preview and selected file states.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleRemoveAvatarFile = () => {
    setPreviewUrl(null)
    setAvatarFile(null)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Uploads the selected poster image file to Supabase storage by calling the
   * updateGroupPosterPath server action.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleUpdateImage = async () => {
    setIsOpenLoader(true)
    try {
      const { error } = await updateGroupPosterPath({
        groupId: groupInfo!.id,
        avatarFile,
        originalPath: groupInfo?.poster_path ?? null,
      })
      if (error) throw new Error(error)
      setIsOpenLoader(false)
      showNotification("Update successfully")
      router.refresh()
    } catch (error) {
      setIsOpenLoader(false)
      if (error instanceof Error) showNotification(error.message)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers the self-exclusion logic, removing the student from the group via the
   * removeStudentsThemselveFromGroupById server action. Upon completion, redirects
   * the user back to the parent event page.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleRemoveStudentSelf = async (groupId: string) => {
    setIsOpenLoader(true)
    try {
      const { error } = await removeStudentsThemselveFromGroupById(groupId)
      if (error) throw new Error(error)
      setIsOpenLoader(false)
      showNotification("Removed from group successfully")
      const eventId = groupInfo?.event_id
      if (eventId) {
        router.push(`/groups`)
      } else {
        router.push("/events")
      }
    } catch (error) {
      setIsOpenLoader(false)
      if (error instanceof Error) showNotification(error.message)
    }
  }

  return (
    <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-montserrat`}>
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">

        {/* Back Navigation */}
        <BackButton />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b3] animate-pulse" />
            <span className="text-[10px] font-mono text-[#00e0b3] uppercase tracking-[0.25em]">
              System_Ready // Config_Access
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight">
            Group_Config: <span className="text-[#00e0b3]">Edit_Mode</span>
          </h1>
          <p className={`${tw.text.onSurfaceVariant} text-sm mt-2 max-w-2xl leading-relaxed opacity-80`}>
            Modify cluster parameters and node assignments.
          </p>
        </motion.div>

        {/* Two-Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column — Identity + Poster + Invite */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <form onSubmit={handleSubmitGroupName(handleSaveGroupName)} className="flex flex-col gap-6">
              <GroupIdentitySection
                registerGroup={registerGroup}
                groupErrors={groupErrors}
                control={control}
                previewUrl={previewUrl}
                handleFileChange={handleFileChange}
                handleRemoveAvatarFile={handleRemoveAvatarFile}
                handleUpdateImage={handleUpdateImage}
              />
            </form>

            <InviteSequence
              groupId={groupInfo?.id ?? ""}
              handleSendInvitation={handleSendInvitation}
            />
          </div>

          {/* Right Column — Member list + Action buttons */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <GroupMemberArray
              groupMembers={groupInfo?.group_members ?? []}
              pendingInvitations={pendingInvitations}
            />

            <GroupActionButtons
              groupId={groupInfo?.id ?? ""}
              groupName={groupInfo?.group_name ?? ""}
              handleRemoveStudentSelf={handleRemoveStudentSelf}
            />
          </div>

        </div>

      </div>
    </div>
  )
}