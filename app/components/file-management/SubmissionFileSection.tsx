/**
 * PURPOSE:
 * Displays the list of uploaded project/submission files. Each file is rendered as a dark,
 * compact card with download links and a delete option, styled following the dark terminal theme.
 *
 * CONTEXT/PARENT FILE:
 * Extracted to a shared component at 'app/components/file-management/SubmissionFileSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - handleCatchFiles ((file: File) => void, Required): Callback to add a newly uploaded file.
 * - submittedFiles (Array, Required): List of already submitted/staged file records.
 * - handleDeleteFiles ((fileIndex: number) => void, Required): Callback to remove a file.
 * - handleDownloadFile ((file) => Promise<void>, Required): Callback to download/view the file.
 */

'use client'

import { ProjectFileExtended } from "@/app/types/project_files"
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { tw } from "@/app/constants/design-tokens"

interface SubmissionFileSectionProps {
  handleCatchFiles?: (file: File) => void
  submittedFiles: Array<SubmissionFileExtended | ProjectFileExtended>
  handleDeleteFiles: (fileIndex: number) => void
  handleDownloadFile: (file: SubmissionFileExtended | ProjectFileExtended) => Promise<void>
}

export default function SubmissionFileSection({
  submittedFiles,
  handleDeleteFiles,
  handleDownloadFile,
}: SubmissionFileSectionProps) {
  return (
    <>
      {submittedFiles && submittedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 w-full select-none">
          {submittedFiles.map((fileItem, index) => (
            <div
              key={index}
              onClick={() => handleDownloadFile(fileItem)}
              className={`${tw.bg.surfaceContainerHigh} ${tw.border.whiteSubtle} border rounded-sm p-4 relative flex flex-col items-center justify-center gap-2 hover:border-[#00e0b3]/30 transition-all duration-300 group cursor-pointer`}
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteFiles(index)
                }}
                className="absolute -top-1.5 -right-1.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full p-0.5 shadow-lg border border-red-500/30 transition-colors z-10 cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xs font-bold">close</span>
              </button>

              {/* Download Indicator Overlay */}
              <span className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 text-[#00e0b3] transition-opacity duration-300 material-symbols-outlined text-xs font-bold">
                download
              </span>

              {/* File Icon */}
              <span className="material-symbols-outlined text-xl text-[#83958d] group-hover:text-[#00e0b3] transition-colors">
                insert_drive_file
              </span>

              {/* Filename */}
              <span className="text-[10px] font-mono text-center text-[#b9cbc2] break-all line-clamp-2 px-1">
                {fileItem.original_file_name}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
