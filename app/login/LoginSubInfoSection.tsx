
import Link from "next/link"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { LoginForm } from "../types/form_data"

interface LoginSubInfoSectionProps {
    register: UseFormRegister<LoginForm>,
    errors: FieldErrors<LoginForm>,
}

const LoginSubInfoSection = ({ register, errors }: LoginSubInfoSectionProps) => {
    return (
        <>
            <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 text-sm font-normal text-black">
                    <input type="checkbox" />
                    Remember me
                </label>
                <Link href={`/forget-password`} className="text-blue-600 font-medium text-sm cursor-pointer">Forgot password?</Link>
            </div>


            <div className="flex flex-col mt-4">
                <div className="flex items-start space-x-2">
                    <input
                        type="checkbox"
                        id="isTermAccepted"
                        className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
                        {...register("isTermAccepted", {
                            required: "You must accept the Terms and Privacy Policy to continue"
                        })}
                    />
                    <label htmlFor="isTermAccepted" className="text-sm text-[#151717] cursor-pointer leading-tight font-roboto-mono">
                        I have read and agree to the{" "}
                        <Link href="/terms-and-conditions" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                            Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                            Privacy Policy
                        </Link>.
                    </label>
                </div>

                {errors.isTermAccepted && (
                    <p className="text-red-500 text-xs mt-1 font-roboto-mono">
                        {errors.isTermAccepted.message}
                    </p>
                )}
            </div>
        </>

    )
}

export default LoginSubInfoSection