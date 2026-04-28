'use client'
import GitHubIcon from '@mui/icons-material/GitHub';
import { useForm } from 'react-hook-form';
import { LoginForm } from '../types/form_data';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { login, resendVerificationCode } from '../actions/authentication';
import { useNotification } from '../context/NotificationContext';
import { AUTH_ERROR_CODE } from '../types/enum';
import { useLoader } from '../context/LoaderContext';
import { useRouter } from 'next/navigation';
import LoginSubInfoSection from './LoginSubInfoSection';
const Home = () => {
    const { showNotification } = useNotification();
    const supabase = createClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<LoginForm>()
    const { setIsOpenLoader } = useLoader()
    const router = useRouter()
    const handleLoginWithGithub = async () => {
        const isAcceptedTerm = getValues('isTermAccepted');
        if (isAcceptedTerm) {
            await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
        } else {
            showNotification('Please accept the terms conditions and privacy policy')
        }
    }
    const onSubmit = async (userInfo: LoginForm) => {
        setIsOpenLoader(true)
        try {
            const { error } = await login(userInfo)

            if (error) {
                throw new Error(error)
            }

        } catch (error) {

            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                if (error instanceof Error && error.message == AUTH_ERROR_CODE.EMAIL_NOT_CONFIRMED) {
                    try {
                        await resendVerificationCode(userInfo.email, window.location.origin)
                        showNotification('Please verify your email')
                        router.push(`/sign-up/verify-account?email=${userInfo.email}`)
                    } catch (error) {
                        showNotification('Failed to send verification code')
                    }
                } else if (error instanceof Error && error.message == AUTH_ERROR_CODE.INVALID_CREDENTIALS) {
                    showNotification("Invalid credentials")
                } else {
                    showNotification('Failed to login')
                }
            } else if (error instanceof Error && error.message == 'NEXT_REDIRECT') {
                showNotification('Login successfully')
            }
            setIsOpenLoader(false)

        }
    }
    return (
        <div className="w-full min-h-screen screen-bg flex justify-center items-center">
            <form className="flex flex-col gap-2 rounded-[50px] bg-[#e0e0e0] 
                               shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]
                               flex flex-col duration-300 p-8 w-[450px] rounded-2xl font-roboto-mono" onSubmit={handleSubmit(onSubmit)}>


                <LoginSubInfoSection register={register} errors={errors} />

                <button className="mt-5 w-full text-white font-medium rounded-xl text-base uppercase login_btn"><i className="animation"></i>Sign In<i className="animation"></i>
                </button>

                <p className="text-center text-sm text-black mt-3">
                    Don&apos;t have an account? <Link href={'/sign-up'} className="text-blue-600 font-medium cursor-pointer">Sign Up</Link>
                </p>

                <p className="text-center text-sm text-black mt-3">OR</p>

                <div className="flex gap-2 mt-3 font-mono text-black">

                    <div
                        className="cursor-pointer flex-1 flex gap-2 justify-center items-center gap-2 h-12 rounded-xl border border-gray-400 bg-white font-medium transition hover:border-blue-600"
                        onClick={() => handleLoginWithGithub()}
                    >
                        <GitHubIcon />
                        <div>Github</div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Home