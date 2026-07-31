/**
 * PURPOSE:
 * Client Component for password reset confirmation.
 * Accepts email, OTP code, new password, and confirm password fields, validates matching inputs,
 * executes password reset via server action, and renders a dark terminal styled form card.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/reset-password/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - email (string, Required): User email passed from search parameters.
 */

'use client'

import { useForm, useWatch } from "react-hook-form"
import HttpsIcon from "@mui/icons-material/Https"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { runProfileAction } from "@/app/actions/profiles/actions.gateway"
import { useLoader } from "../context/LoaderContext"
import { useNotification } from "../context/NotificationContext"
import { ResetPasswordForm } from "../types/form_data"
import { tw } from "../constants/design-tokens"

export const ResetPasswordClient = ({ email }: { email: string }) => {
  const { showNotification } = useNotification()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      email,
    },
  })
  const { setIsOpenLoader } = useLoader()

  const newPasswordValue = useWatch({
    defaultValue: "",
    name: "newPassword",
    control: control,
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Submits new password payload to server action for account update.
   *
   * PARAMETERS:
   * - userInfo (ResetPasswordForm): Form payload containing email, OTP, newPassword, confirmedNewPassword.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (userInfo: ResetPasswordForm): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await runProfileAction({ type: 'resetPassword', payload: userInfo })
      if (error) {
        throw new Error(error)
      }
      setIsOpenLoader(false)
      showNotification("Update successfully")
      router.push("/login")
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        showNotification(error.message)
      }
      setIsOpenLoader(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-8 shadow-2xl flex flex-col gap-5 w-full`}
    >
      {/* Header Title & Badge */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-[3px] h-3 bg-[#00e0b3]" />
          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            AUTHENTICATION_PORTAL // RESET_NODE
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
          RESET_PASSWORD
        </h1>
      </div>

      {/* Disabled Email Input */}
      <div className="flex flex-col">
        <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>Target Email</span>
          <span className="text-[#83958d]">(LOCKED)</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312]/60 border border-white/5 rounded-sm text-[#83958d]">
          <span className="pl-3 text-[#83958d]/50 flex items-center shrink-0">
            <AlternateEmailIcon fontSize="small" />
          </span>
          <input
            disabled
            type="text"
            placeholder="Enter your Email"
            className="w-full bg-transparent text-[#83958d] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none cursor-not-allowed"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid Email",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Received OTP Input */}
      <div className="flex flex-col">
        <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>Received OTP Code</span>
          <span className="text-[#00e0b3]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
          <span className="pl-3 text-[#83958d] flex items-center shrink-0">
            <HttpsIcon fontSize="small" />
          </span>
          <input
            type="password"
            placeholder="Enter your Received OTP"
            className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none"
            {...register("otp", {
              required: "OTP is required",
            })}
          />
        </div>
        {errors.otp && (
          <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* New Password Input */}
      <div className="flex flex-col">
        <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>New Password</span>
          <span className="text-[#00e0b3]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
          <span className="pl-3 text-[#83958d] flex items-center shrink-0">
            <HttpsIcon fontSize="small" />
          </span>
          <input
            type="password"
            placeholder="Enter your New Password"
            className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: {
                value: 8,
                message: "Password must above 8 characters",
              },
            })}
          />
        </div>
        {errors.newPassword && (
          <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password Input */}
      <div className="flex flex-col">
        <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>Confirm New Password</span>
          <span className="text-[#00e0b3]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
          <span className="pl-3 text-[#83958d] flex items-center shrink-0">
            <HttpsIcon fontSize="small" />
          </span>
          <input
            type="password"
            placeholder="Confirm your new password"
            className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none"
            {...register("confirmedNewPassword", {
              required: "Confirm New Password Required",
              minLength: {
                value: 8,
                message: "Password must above 8 characters",
              },
              validate: (val: string) => {
                if (newPasswordValue !== val) {
                  return "Password does not match"
                }
              },
            })}
          />
        </div>
        {errors.confirmedNewPassword && (
          <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
            {errors.confirmedNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 w-full bg-[#00e0b3] text-[#00382b] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00e0b3]/10"
      >
        Update Password
      </button>

      {/* Switch to Sign Up */}
      <p className="text-center text-xs font-mono text-[#83958d] mt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#00e0b3] font-bold hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  )
}

export default ResetPasswordClient