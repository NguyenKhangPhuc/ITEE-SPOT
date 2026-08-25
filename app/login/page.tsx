/**
 * PURPOSE:
 * Client Component representing the Sign In portal.
 * Authenticates users via email/password or Github OAuth, manages verification triggers,
 * and renders a dark terminal themed login container.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/login/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

'use client'

import GitHubIconMui from "@mui/icons-material/GitHub"
import GoogleIcon from "@mui/icons-material/Google"
// import MicrosoftIcon from "@mui/icons-material/Microsoft"
import { useForm } from "react-hook-form"
import { LoginForm } from "../types/form_data"
import Link from "next/link"
import { createClient } from "../utils/supabase/client"
import { login } from "../actions/authentication/post/login"
import { resendVerificationCode } from "../actions/authentication/post/resendVerificationCode"
import { useNotification } from "../context/NotificationContext"
import { AUTH_ERROR_CODE } from "../types/enum"
import { useLoader } from "../context/LoaderContext"
import { useRouter } from "next/navigation"
import LoginSubInfoSection from "./LoginSubInfoSection"
import LoginMainInfoSection from "./LoginMainInfoSection"
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
  } = useForm<LoginForm>()
  const { setIsOpenLoader } = useLoader()
  const router = useRouter()

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

  /*
  const handleLoginWithMicrosoft = async (): Promise<void> => {
    const isAcceptedTerm = getValues("isTermAccepted")
    if (isAcceptedTerm) {
      await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "email openid profile",
        },
      })
    } else {
      showNotification("Please accept the terms conditions and privacy policy")
    }
  }
  */

  /**
   * BEHAVIORAL MECHANISM:
   * Initiates Google OAuth flow after validating Terms & Conditions acceptance.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleGoogleOauthLogin = async (): Promise<void> => {
    const isAcceptedTerm = getValues("isTermAccepted")
    if (isAcceptedTerm) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } else {
      showNotification("Please accept the terms conditions and privacy policy")
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers the user login server action and handles unverified email redirects.
   *
   * PARAMETERS:
   * - userInfo (LoginForm): Form payload containing email, password, and terms checkbox.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (userInfo: LoginForm): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await login(userInfo)
      if (error) {
        throw new Error(error)
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        if (error.message === AUTH_ERROR_CODE.EMAIL_NOT_CONFIRMED) {
          try {
            await resendVerificationCode(userInfo.email, window.location.origin)
            showNotification("Please verify your email")
            router.push(`/sign-up/verify-account?email=${userInfo.email}`)
          } catch (error) {
            showNotification("Failed to send verification code")
          }
        } else if (error.message === AUTH_ERROR_CODE.INVALID_CREDENTIALS) {
          showNotification("Invalid credentials")
        } else {
          showNotification("Failed to login")
        }
      } else if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        showNotification("Login successfully")
      }
      setIsOpenLoader(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono flex items-center justify-center p-6 py-12 select-none">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Top Navigation */}

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
                AUTHENTICATION_PORTAL // AUTH_NODE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              SIGN_IN
            </h1>
          </div>

          {/* Form Inputs */}
          <LoginMainInfoSection register={register} errors={errors} />
          <LoginSubInfoSection register={register} errors={errors} />

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-[#00e0b3] text-[#00382b] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00e0b3]/10"
          >
            Sign In
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
              onClick={handleLoginWithGithub}
              className="w-full flex items-center justify-center gap-3 bg-[#151312] border border-white/10 text-[#e8e1df] hover:border-[#00e0b3]/50 font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all cursor-pointer"
            >
              <GitHubIconMui fontSize="small" />
              <span>Sign In with Github</span>
            </div>

            <div
              onClick={handleGoogleOauthLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#151312] border border-white/10 text-[#e8e1df] hover:border-[#00e0b3]/50 font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all cursor-pointer"
            >
              <GoogleIcon fontSize="small" />
              <span>Sign In with Google</span>
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