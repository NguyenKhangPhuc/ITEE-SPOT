/**
 * PURPOSE:
 * Client Component representing the Sign Up portal.
 * Registers new user accounts, handles terms acceptance validation, triggers OAuth flow,
 * and renders a dark terminal themed sign-up form card.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/sign-up/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

'use client'

import HttpsIcon from "@mui/icons-material/Https"
import GitHubIconMui from "@mui/icons-material/GitHub"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import PersonIcon from "@mui/icons-material/Person"
import { useForm } from "react-hook-form"
import { SignupForm } from "../types/form_data"
import { createClient } from "../utils/supabase/client"
import { signup } from "../actions/authentication"
import { useNotification } from "../context/NotificationContext"
import Link from "next/link"
import { AUTH_ERROR_CODE } from "../types/enum"
import { useLoader } from "../context/LoaderContext"
import { useRouter } from "next/navigation"
import { tw } from "../constants/design-tokens"
import BackButton from "../components/BackButton"

const Home = () => {
  const { showNotification } = useNotification()
  const supabase = createClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupForm>()
  const { setIsOpenLoader } = useLoader()

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers user sign-up action and reports existing account warnings.
   *
   * PARAMETERS:
   * - signupInfo (SignupForm): Form values payload.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (signupInfo: SignupForm): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await signup(signupInfo, window.location.origin)
      if (error) {
        throw new Error(error)
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        if (error.message === AUTH_ERROR_CODE.EXISTED_USER) {
          showNotification("User already existed")
        } else {
          showNotification("Fail to sign up")
        }
      } else if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        showNotification("Sign up successfully, please verify your email")
      }
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Initiates Github OAuth flow after validating Terms & Conditions acceptance.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleLoginWithGithub = async (): Promise<void> => {
    const isAcceptedTerm = getValues("isTermAccepted")
    if (isAcceptedTerm) {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } else {
      showNotification("Please accept the terms conditions and privacy policy")
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
          {/* Header Title & Badge */}
          <div className="flex flex-col gap-2 border-b border-white/5 pb-5">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-3 bg-[#00e0b3]" />
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
                AUTHENTICATION_PORTAL // SIGN_UP_NODE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              CREATE_ACCOUNT
            </h1>
          </div>

          {/* Full Name Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[#00e0b3]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
              <span className="pl-3 text-[#83958d] flex items-center shrink-0">
                <PersonIcon fontSize="small" />
              </span>
              <input
                type="text"
                placeholder="Enter your Full Name"
                className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none"
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[#00e0b3]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
              <span className="pl-3 text-[#83958d] flex items-center shrink-0">
                <AlternateEmailIcon fontSize="small" />
              </span>
              <input
                type="text"
                placeholder="Enter your email address"
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

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
              <span>Password</span>
              <span className="text-[#00e0b3]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
              <span className="pl-3 text-[#83958d] flex items-center shrink-0">
                <HttpsIcon fontSize="small" />
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 font-mono text-xs p-3 outline-none border-none"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must above 8 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 text-xs font-mono text-[#83958d] cursor-pointer">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 cursor-pointer accent-[#00e0b3] bg-[#151312] border border-white/10 rounded-sm"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forget-password"
              className="text-xs font-mono text-[#00e0b3] hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex flex-col mt-1">
            <div className="flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="isTermAccepted"
                className="mt-0.5 h-3.5 w-3.5 cursor-pointer accent-[#00e0b3] bg-[#151312] border border-white/10 rounded-sm shrink-0"
                {...register("isTermAccepted", {
                  required: "You must accept the Terms and Privacy Policy to continue",
                })}
              />
              <label
                htmlFor="isTermAccepted"
                className="text-xs text-[#83958d] cursor-pointer leading-relaxed font-mono"
              >
                I have read and agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-[#00e0b3] underline hover:text-[#00e0b3]/80 transition-colors"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-[#00e0b3] underline hover:text-[#00e0b3]/80 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {errors.isTermAccepted && (
              <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
                {errors.isTermAccepted.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-[#00e0b3] text-[#00382b] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00e0b3]/10"
          >
            Sign Up
          </button>

          {/* Switch to Sign In */}
          <p className="text-center text-xs font-mono text-[#83958d] mt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#00e0b3] font-bold hover:underline transition-colors"
            >
              Sign In
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

          {/* OAuth Github Button */}
          <div
            onClick={handleLoginWithGithub}
            className="w-full flex items-center justify-center gap-3 bg-[#151312] border border-white/10 text-[#e8e1df] hover:border-[#00e0b3]/50 font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all cursor-pointer"
          >
            <GitHubIconMui fontSize="small" />
            <span>Sign Up with Github</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home