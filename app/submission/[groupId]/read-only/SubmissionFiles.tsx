'use client'

import { getSignedUrl } from "@/app/actions/file_url"
import { useNotification } from "@/app/context/NotificationContext"
import { SubmissionFileExtended } from "@/app/types/submission_files"

interface SubmissionFilesProps {
    submittedFiles: SubmissionFileExtended[]

}import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
const SubmissionFiles = ({ submittedFiles }: SubmissionFilesProps) => {
    const { showNotification } = useNotification()
    const handleDownloadFile = async (file: SubmissionFileExtended) => {
        if (file.storage_path != null && file.storage_path != "") {
            try {
                const data = await getSignedUrl(file.storage_path)
                if (data.signedUrl) {
                    window.open(data.signedUrl, '_blank');
                }
            } catch (error) {
                console.log(error)
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        } else {
            const localUrl = URL.createObjectURL(file.file!);
            window.open(localUrl, '_blank');
        }
    }
    return (
        <>
            <div className="text-lg font-bold uppercase tracking-tight">Submitted File</div>
            {submittedFiles?.length > 0 ? (

                <div className="grid grid-cols-7 gap-4 w-full">
                    {submittedFiles.map((fileItem, index) => (
                        <div
                            key={index}
                            onClick={() => handleDownloadFile(fileItem)}
                            className="cursor-pointer relative h-30 min-w-full flex flex-col items-center justify-center p-2 bg-white rounded-md border border-gray-100 shadow-xl shadow-black/30 hover:scale-105 group duration-300 cursor"
                        >
                            <button

                                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 text-black transition-opacity duration-300"
                                type="button"
                            >
                                <DownloadIcon sx={{ fontSize: '18px' }} />
                            </button>

                            <div className="text-gray-400 mb-1">
                                <InsertDriveFileIcon />
                            </div>

                            <span className="text-[13px] text-center font-medium text-black break-all line-clamp-2 px-1">
                                {fileItem.original_file_name}
                            </span>
                        </div>
                    ))}
                </div>

            ) : <div className="text-sm opacity-70">Student did not upload anything</div>}
        </>
    )
}

export default SubmissionFiles