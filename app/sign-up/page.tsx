'use client'
import HttpsIcon from '@mui/icons-material/Https';
import GitHubIcon from '@mui/icons-material/GitHub';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import { useForm } from 'react-hook-form';
import { LoginForm, SignupForm } from '../types/form_data';
import { createClient } from '../utils/supabase/client';
import { signup } from '../actions/authentication';
import { useNotification } from '../context/NotificationContext';
import Link from 'next/link';
const Home = () => {
    const { showNotification } = useNotification();
    const supabase = createClient();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupForm>()

    const onSubmit = async (signupInfo: SignupForm) => {
        try {
            await signup(signupInfo, window.location.origin)
        } catch (error) {
            console.log(error + `--- ${error == 'Error: NEXT_REDIRECT' ? 'true' : 'false'}`)
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {

                showNotification(error.message)
            }
        }
    }

    return (
        <div className="w-full min-h-screen screen-bg flex justify-center items-center">
            <form className="flex flex-col gap-2 rounded-[50px] bg-[#e0e0e0] 
                               shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]
                               flex flex-col duration-300 p-8 w-[450px] rounded-2xl font-roboto-mono" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <label className="text-[#151717] mb-1 font-semibold">Full Name</label>
                    <div className="border border-gray-200 rounded-xl h-12 flex items-center px-2 focus-within:border-blue-600 transition text-black/50">
                        <PersonIcon />
                        <input
                            type="text"
                            placeholder="Enter your Full Name"
                            className="flex-1 h-full border-none outline-none px-2 placeholder-gray-400  text-black "
                            {...register("fullName", {
                                required: "Full name is required",
                            })}
                        />
                    </div>
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.fullName.message}
                        </p>
                    )}
                </div>
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

                <div className="flex flex-col ">
                    <label className="text-[#151717] font-semibold mb-1">Password</label>
                    <div className="border border-gray-200 rounded-xl h-12 flex items-center px-2 focus-within:border-blue-600 transition text-black/50">
                        <HttpsIcon />
                        <input
                            type="password"
                            placeholder="Enter your Password"
                            className="flex-1 h-full border-none outline-none px-2 placeholder-gray-400"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must above 8 characters"
                                }
                            })}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 text-sm font-normal text-black">
                        <input type="checkbox" />
                        Remember me
                    </label>
                    <Link href={`/forget-password`} className="text-blue-600 font-medium text-sm cursor-pointer">Forgot password?</Link>
                </div>

                <button className="mt-5 w-full text-white font-medium rounded-xl text-base uppercase login_btn"><i className="animation"></i>Sign Up<i className="animation"></i>
                </button>

                <p className="text-center text-sm text-black mt-3">
                    Already have an account? <Link href={'/login'} className="text-blue-600 font-medium cursor-pointer">Sign In</Link>
                </p>

                <p className="text-center text-sm text-black mt-3">OR</p>

                <div className="flex gap-2 mt-3 font-mono text-black">

                    <div className="cursor-pointer flex-1 cursor-pointer flex gap-2 justify-center items-center gap-2 h-12 rounded-xl border border-gray-400 bg-white font-medium transition hover:border-blue-600">
                        <GitHubIcon />
                        <div>Github</div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Home