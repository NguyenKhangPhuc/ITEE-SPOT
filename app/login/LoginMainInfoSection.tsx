/**
 * PURPOSE:
 * Renders the primary form input fields (Email and Password) for the Login portal,
 * styled using dark terminal design tokens with focus glow transitions and error handling.
 *
 * CONTEXT/PARENT FILE:
 * Mounted inside 'app/login/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<LoginForm>, Required): React Hook Form register function.
 * - errors (FieldErrors<LoginForm>, Required): React Hook Form field validation errors object.
 */

import { useState } from 'react'
import HttpsIcon from '@mui/icons-material/Https'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { LoginForm } from '../types/form_data'

interface LoginMainInfoSectionProps {
  register: UseFormRegister<LoginForm>
  errors: FieldErrors<LoginForm>
}

const LoginMainInfoSection = ({ register, errors }: LoginMainInfoSectionProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <>
      {/* Email Input Field */}
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

      {/* Password Input Field */}
      <div className="flex flex-col mt-4">
        <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between">
          <span>Password</span>
          <span className="text-[#00e0b3]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00e0b3]/50 transition-all text-[#e8e1df]">
          <span className="pl-3 text-[#83958d] flex items-center shrink-0">
            <HttpsIcon fontSize="small" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
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
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="pr-3 text-[#83958d] hover:text-[#e8e1df] transition-colors focus:outline-none flex items-center shrink-0 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 font-mono text-[9px] mt-1 uppercase tracking-wider">
            {errors.password.message}
          </p>
        )}
      </div>
    </>
  )
}

export default LoginMainInfoSection