'use client'

import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { INVITATION_STATUS } from "@/app/types/enum"
import { InvitationInsert } from "@/app/types/invitation"
import { tw } from "@/app/constants/design-tokens"

interface InviteSequenceProps {
  groupId: string
  handleSendInvitation: (invitationInfo: InvitationInsert) => Promise<void>
}

/**
 * PURPOSE:
 * Renders the Invitation Sequence panel for inviting new nodes to join the group.
 * It contains an email text input and an action button to initialize a member invitation.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/groups/[id]/SingleGroupClient.tsx' and placed in
 * 'app/groups/[id]/components/InviteSequence.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): The database ID of the current group.
 * - handleSendInvitation ((invitationInfo: InvitationInsert) => Promise<void>, Required):
 *   Callback function that executes the invitation creation server action.
 */
export default function InviteSequence({
  groupId,
  handleSendInvitation,
}: InviteSequenceProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvitationInsert>({
    defaultValues: {
      member_email: "",
      group_id: groupId,
      invitation_status: INVITATION_STATUS.PENDING,
    },
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Wraps the parent handleSendInvitation callback. It triggers validation checks on the email
   * input, executes the callback, and resets the form on successful submission.
   *
   * PARAMETERS:
   * - data (InvitationInsert): Validated form object from react-hook-form.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (data: InvitationInsert) => {
    await handleSendInvitation(data)
    reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <span className="material-symbols-outlined text-sm text-[#00e0b3]">mail</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
          Invite_Sequence
        </span>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow flex flex-col gap-1">
            <input
              autoComplete="off"
              placeholder="@ Enter node email..."
              type="text"
              className={`w-full bg-[#151312] border ${
                errors.member_email ? 'border-red-400/50' : 'border-white/10'
              } rounded-sm px-4 py-2.5 text-xs font-mono text-[#e8e1df] placeholder:text-[#83958d]/50 focus:outline-none focus:border-[#00e0b3]/50 transition-colors`}
              {...register('member_email', {
                required: "Member email is required",
                setValueAs: (v: string) => (v.trim() === "" ? null : v.toLowerCase().trim())
              })}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer border border-[#00e0b3]/40 bg-transparent hover:bg-[#00e0b3]/10 text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 sm:py-0 transition-all duration-300 rounded-sm shrink-0"
          >
            Initialize Invitation
          </button>
        </div>

        {errors.member_email && (
          <p className="text-red-400 text-[10px] font-mono">{errors.member_email.message}</p>
        )}
      </form>
    </motion.div>
  )
}
