import { updateEventPoster } from '@/app/actions/events';
import { useLoader } from '@/app/context/LoaderContext';
import { useNotification } from '@/app/context/NotificationContext';
import { EventWithChallenges } from '@/app/types/event';
import { createClient } from '@/app/utils/supabase/client';
import Image from 'next/image'
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { ProfileInsert } from '../types/profile';
import { updateProfileAvatar } from '../actions/profiles';
const UserPosterSection = ({ user }: { user: ProfileInsert }) => {
    const supabase = createClient()
    const handleGetInitialImage = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }
    const [previewUrl, setPreviewUrl] = useState(user.avatar_url ? handleGetInitialImage(user.avatar_url!) : null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const handleFileChange = (file: File) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setAvatarFile(file)
        }
    };

    const handleRemoveAvatarFile = () => {
        setPreviewUrl(null)
        setAvatarFile(null)
    }

    const handleUpdateImage = async () => {
        setIsOpenLoader(true)
        try {
            const { error } = await updateProfileAvatar({ userId: user.id, posterFile: avatarFile, originalPath: user.avatar_url ?? null })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification("Update image successfully")
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
            setIsOpenLoader(false)
        }
    }
    return (
        <div className="w-full flex flex-col items-center gap-3">
            <div className="relative w-40 h-40 group">
                <div className="relative w-full h-full rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition-all duration-300 bg-gray-50">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Avatar"
                            width={200}
                            height={200}
                            sizes="200px"

                            className="object-cover rounded-full "
                        />
                    ) : (
                        <div className="text-center p-2 text-xs text-gray-500 font-medium">
                            Pick an image to show
                        </div>
                    )}

                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                handleFileChange(files[0]);
                            }
                        }}
                    />
                </div>

                {previewUrl && (
                    <button
                        onClick={() => handleRemoveAvatarFile()}
                        className="w-5 h-5 flex items-center justify-center absolute top-3 right-3 bg-black text-white rounded-full shadow-lg 
                                         transition-colors z-20 cursor-pointer hover:bg-black/70 duration-300"
                        type="button"
                    >
                        <ClearIcon sx={{ fontSize: 16, color: 'white' }} />
                    </button>
                )}
            </div>
            <button className={`bg-black px-5 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                type="button" onClick={() => handleUpdateImage()}
            >
                Save image
            </button>
        </div>
    )
}

export default UserPosterSection