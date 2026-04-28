import Image from 'next/image'
import ClearIcon from '@mui/icons-material/Clear';
interface GroupAvatarProps {
    previewUrl: string | null,
    handleFileChange: (file: File) => void,
    handleRemoveAvatarFile: () => void
    handleUpdateImage: () => Promise<void>
}
const GroupAvatar = ({
    previewUrl,
    handleFileChange,
    handleRemoveAvatarFile,
    handleUpdateImage }: GroupAvatarProps) => {
    return (
        <div className="w-full flex flex-col items-center gap-5">
            <div className="relative w-40 h-40 group">
                <div className="relative w-full h-full rounded-full border-2 border-dashed border-gray-500 
                               flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition-all duration-300 bg-gray-50">
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

export default GroupAvatar