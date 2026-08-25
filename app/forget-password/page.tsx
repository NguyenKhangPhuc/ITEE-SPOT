/**
 * PURPOSE:
 * Client Component for requesting password reset OTP emails.
 * Sends reset password OTP to specified user email via Supabase Auth,
 * and renders a dark terminal styled form card.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/forget-password/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

'use client'

import GitHubIconMui from "@mui/icons-material/GitHub"
import GoogleIcon from "@mui/icons-material/Google"
// import MicrosoftIcon from "@mui/icons-material/Microsoft"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import { useForm } from "react-hook-form"
import { LoginForm } from "../types/form_data"
import Link from "next/link"
import { createClient } from "../utils/supabase/client"
import { useNotification } from "../context/NotificationContext"
import { useRouter } from "next/navigation"
import { useLoader } from "../context/LoaderContext"
import { tw } from "../constants/design-tokens"
import BackButton from "../components/BackButton"

const Home = () => {
  const { showNotification } = useNotification()
  const supabase = createClient()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()
  const { setIsOpenLoader } = useLoader()

  /**
   * BEHAVIORAL MECHANISM:
   * Initiates Github OAuth flow.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleLoginWithGithub = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  /*
  const handleLoginWithMicrosoft = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "email openid profile",
      },
    })
  }
  */

  /**
   * BEHAVIORAL MECHANISM:
   * Initiates Google OAuth flow.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleGoogleOauthLogin = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Sends password reset OTP for target email address.
   *
   * PARAMETERS:
   * - userInfo (LoginForm): Form data payload containing target email.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (userInfo: LoginForm): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userInfo.email)
      if (error) {
        throw new Error("Failed to send the verification code")
      }
      showNotification("Send OTP code successfully")
      setIsOpenLoader(false)
      router.push(`/reset-password?email=${userInfo.email}`)
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      }
      setIsOpenLoader(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono flex items-center justify-center p-6 py-12 select-none">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Top Navigation */}
        <BackButton />

        {/* Auth Form Container Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-8 shadow-2xl flex flex-col gap-5`}
        >
          {/* Back to Sign In Link */}
          <Link
            href="/login"
            className="flex font-mono text-xs text-[#83958d] hover:text-[#00e0b3] transition-colors items-center gap-2 cursor-pointer pb-2 border-b border-white/5"
          >
            <ArrowBackIosNewIcon sx={{ fontSize: "12px" }} />
            <span>Back to sign in</span>
          </Link>

          {/* Header Title & Badge */}
          <div className="flex flex-col gap-2 border-b border-white/5 pb-5">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-3 bg-[#00e0b3]" />
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
                AUTHENTICATION_PORTAL // RECOVERY_NODE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              FORGET_PASSWORD
            </h1>
          </div>

          {/* Email Address Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
              <span>Account Email</span>
              <span className="text-[#00e0b3]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
              <span className="pl-3 text-[#83958d] flex items-center shrink-0">
                <AlternateEmailIcon fontSize="small" />
              </span>
              <input
                type="text"
                placeholder="Enter your registered email"
                className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none"
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

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-[#00e0b3] text-[#00382b] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00e0b3]/10"
          >
            Send OTP
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-2.5">
            <div
              onClick={handleGoogleOauthLogin}
              className="w-full flex items-center justify-between px-4 bg-[#151312] border border-[#00e0b3]/30 text-[#e8e1df] hover:border-[#00e0b3] font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all cursor-pointer shadow-sm shadow-[#00e0b3]/5"
            >
              <div className="flex items-center gap-3">
                <GoogleIcon fontSize="small" className="text-[#00e0b3]" />
                <span>Sign In with Google</span>
              </div>
              <span className="text-[8px] font-mono text-[#00e0b3] bg-[#00e0b3]/10 border border-[#00e0b3]/30 px-2 py-0.5 rounded-xs uppercase tracking-widest font-bold">
                Recommended
              </span>
            </div>

            <div
              onClick={handleLoginWithGithub}
              className="w-full flex items-center justify-center gap-3 bg-[#151312] border border-white/10 text-[#e8e1df] hover:border-[#00e0b3]/50 font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all cursor-pointer"
            >
              <GitHubIconMui fontSize="small" />
              <span>Sign In with Github</span>
            </div>

            {/*
            <div
              onClick={handleLoginWithMicrosoft}
              className="w-full flex items-center justify-center gap-3 bg-[#151312] border border-white/10 text-[#e8e1df] hover:border-[#00e0b3]/50 font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all cursor-pointer"
            >
              <MicrosoftIcon fontSize="small" />
              <span>Sign In with Microsoft</span>
            </div>
            */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home