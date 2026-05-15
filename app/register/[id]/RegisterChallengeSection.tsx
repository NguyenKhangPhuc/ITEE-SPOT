import { EventChallengeInsert } from "@/app/types/event_challenges";
import { RegisterGroupMember } from "@/app/types/group_member";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface RegisterChallengeSection {
    register: UseFormRegister<RegisterGroupMember>,
    errors: FieldErrors<RegisterGroupMember>,
    challenges: Array<EventChallengeInsert>
}
const RegisterChallengeSection = ({ register, errors, challenges }: RegisterChallengeSection) => {
    return (
        <div className="flex flex-col gap-4 w-full mt-4">
            <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                {challenges.map((challenge) => (
                    <div key={challenge.id} className="group relative cursor-pointer">

                        <div className="relative w-full p-5 border rounded-xl peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                            <div className="text-sm w-2/3 font-light">{challenge.company_name}</div>
                            <h4 className="font-bold w-2/3">{challenge.title}</h4>

                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <label className="checkbox_container">
                                    <input type="checkbox" value={challenge.id}

                                        {...register('challenges', {
                                            validate: (value) => {
                                                if (!value || value.length == 0) {
                                                    return "Please choose your challenges";
                                                }
                                                return true
                                            }
                                        })} />
                                    <div className="checkmark"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {errors.challenges?.message && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.challenges.message}
                </p>
            )}
        </div>
    )
}

export default RegisterChallengeSection