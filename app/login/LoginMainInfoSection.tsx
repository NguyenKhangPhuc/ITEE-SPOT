import HttpsIcon from '@mui/icons-material/Https';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { register } from 'module';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LoginForm } from '../types/form_data';
interface LoginMainInfoSection {
    register: UseFormRegister<LoginForm>,
    errors: FieldErrors<LoginForm>,
}
const LoginMainInfoSection = ({ register, errors }: LoginMainInfoSection) => {
    return (
        <>
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
        </>
    )
}

export default LoginMainInfoSection