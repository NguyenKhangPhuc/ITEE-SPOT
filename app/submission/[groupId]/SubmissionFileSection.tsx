import { ProjectFileExtended } from '@/app/types/project_files';
import { SubmissionFileExtended } from '@/app/types/submission_files';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface SubmissionFileSectionProps {
    handleCatchFiles: (file: File) => void,
    submittedFiles: SubmissionFileExtended[] | ProjectFileExtended[],
    handleDeleteFiles: (fileIndex: number) => void,
    handleDownloadFile: (file: SubmissionFileExtended | ProjectFileExtended) => Promise<void>
}
const SubmissionFileSection = ({
    handleCatchFiles, submittedFiles, handleDeleteFiles, handleDownloadFile
}: SubmissionFileSectionProps) => {
    return (
        <>
            <div className="relative w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors group">
                <div className="text-center pointer-events-none">
                    <p className="text-gray-600">
                        <span className="font-semibold">Paste or drop a file here</span> or click to upload
                    </p>
                    <p className="text-xs text-gray-400">PDF, WORD, PPTX (max. 5MB)</p>
                </div>

                <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf, .doc, .docx, .ppt, .pptx"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                            handleCatchFiles(files[0]);
                        }
                    }}
                />
            </div>
            {submittedFiles?.length > 0 && (

                <div className="grid lg:grid-cols-7 md:grid-cols-5 grid-cols-3 gap-4 w-full">
                    {submittedFiles.map((fileItem, index) => (
                        <div
                            key={index}
                            onClick={() => handleDownloadFile(fileItem)}
                            className="cursor-pointer relative h-30 min-w-full flex flex-col items-center justify-center p-2 bg-white rounded-md border border-gray-100 shadow-xl shadow-black/30 hover:scale-102 group duration-300 cursor"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFiles(index);
                                }}
                                className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors z-10"
                                type="button"
                            >
                                <ClearIcon />
                            </button>

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

            )}
        </>
    )
}

export default SubmissionFileSection