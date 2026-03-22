'use client'
import { createClient } from "@supabase/supabase-js";
import { useNotification } from "../context/NotificationContext";
import { LoginForm, ResetPasswordForm } from "../types/form_data";
import { useForm, useWatch } from "react-hook-form";
import HttpsIcon from '@mui/icons-material/Https';
import GitHubIcon from '@mui/icons-material/GitHub';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Link from 'next/link';
import { resetPassword } from "../actions/profiles";
import { useRouter } from "next/navigation";
export const ResetPasswordClient = ({ email }: { email: string }) => {
    const { showNotification } = useNotification();
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ResetPasswordForm>({
        defaultValues: {
            email
        }
    })

    const newPasswordValue = useWatch({
        defaultValue: "",
        name: 'newPassword',
        control: control

    });
    const onSubmit = async (userInfo: ResetPasswordForm) => {
        try {
            await resetPassword(userInfo)
            showNotification('Update successfully')
            router.push('/')
        } catch (error) {
            console.log(error + `--- ${error == 'Error: NEXT_REDIRECT' ? 'true' : 'false'}`)
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                showNotification(error.message)
            }

        }
    }
    return (
        <form className="flex flex-col gap-2 rounded-[50px] bg-[#e0e0e0] 
                               shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]
                               flex flex-col duration-300 p-8 w-[450px] rounded-2xl font-roboto-mono" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <label className="text-[#151717] mb-1 font-semibold">Email</label>
                <div className="border border-gray-200 rounded-xl h-12 flex items-center px-2 focus-within:border-blue-600 transition text-black/50">
                    <AlternateEmailIcon />
                    <input
                        type="text"
                        placeholder="Enter your Email"
                        className="flex-1 h-full border-none outline-none px-2 placeholder-gray-400  text-black "
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid Email"
                            }
                        })}
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col mt-4">
                <label className="text-[#151717] font-semibold mb-1">Received OTP</label>
                <div className="border border-gray-200 rounded-xl h-12 flex items-center px-2 focus-within:border-blue-600 transition text-black/50">
                    <HttpsIcon />
                    <input
                        type="password"
                        placeholder="Enter your Received OTP"
                        className="flex-1 h-full border-none outline-none px-2 placeholder-gray-400"
                        {...register('otp', {
                            required: "OTP is required",
                            minLength: {
                                value: 6,
                                message: "OTP must be 6 number"
                            },
                            maxLength: {
                                value: 6,
                                message: "OTP must be 6 number"
                            }
                        })}
                    />
                </div>
                {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.otp.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col mt-4">
                <label className="text-[#151717] font-semibold mb-1"> New Password</label>
                <div className="border border-gray-200 rounded-xl h-12 flex items-center px-2 focus-within:border-blue-600 transition text-black/50">
                    <HttpsIcon />
                    <input
                        type="password"
                        placeholder="Enter your Password"
                        className="flex-1 h-full border-none outline-none px-2 placeholder-gray-400"
                        {...register('newPassword', {
                            required: "New Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must above 8 characters"
                            }
                        })}
                    />
                </div>
                {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col mt-4">
                <label className="text-[#151717] font-semibold mb-1">Confirm your password</label>
                <div className="border border-gray-200 rounded-xl h-12 flex items-center px-2 focus-within:border-blue-600 transition text-black/50">
                    <HttpsIcon />
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        className="flex-1 h-full border-none outline-none px-2 placeholder-gray-400"
                        {...register('confirmedNewPassword', {
                            required: "Confirm New Password Required",
                            minLength: {
                                value: 8,
                                message: "Password must above 8 characters"
                            },
                            validate: (val: string) => {
                                if (newPasswordValue != val) {
                                    return "Password does not match";
                                }
                            }
                        })}
                    />
                </div>
                {errors.confirmedNewPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.confirmedNewPassword.message}
                    </p>
                )}
            </div>

            <button className="mt-5 w-full text-white font-medium rounded-xl text-base uppercase login_btn"><i className="animation"></i>Update Password<i className="animation"></i>
            </button>

            <p className="text-center text-sm text-black mt-3">
                Don&apos;t have an account? <Link href={'/sign-up'} className="text-blue-600 font-medium cursor-pointer">Sign Up</Link>
            </p>


        </form>
    )
}

export default ResetPasswordClient