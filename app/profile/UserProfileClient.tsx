'use client'
import { updateProfile } from "../actions/profiles"
import { useLoader } from "../context/LoaderContext"
import { useNotification } from "../context/NotificationContext"
import { DEGREE, PROGRAMME, UNIVERSITY, YEAR } from "../types/enum"
import { Profile, ProfileInsert } from "../types/profile"
import { useForm } from "react-hook-form"
import UserTextInfoSection from "./UserTextInfoSection"
import UserSelectionInfoSection from "./UserSelectionInfoSection"
import UserLinkInfoSection from "./UserLinkInfoSection"
import UserPosterSection from "./UserPosterSection"

const UserProfileClient = ({ user }: { user: Profile }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProfileInsert>({
        defaultValues: user
    })

    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const onSubmit = async (data: ProfileInsert) => {
        setIsOpenLoader(true)
        try {
            const { data: updatedValue, error } = await updateProfile({ profile: data })
            if (error) {
                throw new Error(error)
            }
            if (updatedValue) {
                reset(updatedValue)
                showNotification('Update Successfully')
            } else {
                showNotification('Fail to update the profile')
            }
            setIsOpenLoader(false)
        } catch (error) {

            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }
    return (
        <div className="w-full p-5 mt-5 content-main-color rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">

                <UserPosterSection user={user} />
                <UserTextInfoSection register={register} user={user} errors={errors} />
                <UserSelectionInfoSection register={register} errors={errors} />
                <UserLinkInfoSection register={register} errors={errors} />

                <div className="w-full pt-4">
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black/80 transition-colors duration-300"
                    >
                        Save profile
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserProfileClient