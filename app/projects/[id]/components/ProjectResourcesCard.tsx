/**
 * PURPOSE:
 * Renders the Project Resources sidebar card containing the source repository link (GitHub)
 * and downloadable payload files.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/[id]/SingleProjectClient.tsx' to modularize files and links sidebar.
 *
 * INPUTS / PARAMETERS:
 * - githubLink (string | null, Required): The repository URL.
 * - projectFiles (ProjectFilesInsert[], Required): Array of submitted project files.
 */

'use client'

import { ProjectFilesInsert } from "../../../types/project_files"
import { getPublicFileURL } from "@/app/actions/file_url"
import { useNotification } from "@/app/context/NotificationContext"
import { tw } from "@/app/constants/design-tokens"

interface ProjectResourcesCardProps {
  githubLink: string | null
  projectFiles: ProjectFilesInsert[]
}

export default function ProjectResourcesCard({
  githubLink,
  projectFiles,
}: ProjectResourcesCardProps) {
  const { showNotification } = useNotification()

  /**
   * BEHAVIORAL MECHANISM:
   * Handles storage file download. Resolves the public Supabase bucket file URL and triggers browser download.
   *
   * PARAMETERS:
   * - storagePath (string | null): The file storage path in Supabase.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDownloadFile = async (storagePath: string | null) => {
    if (!storagePath) return
    try {
      const { data, error } = await getPublicFileURL(storagePath)
      if (error) throw new Error(error)
      if (data?.publicUrl) {
        window.open(data.publicUrl, "_blank")
      }
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      }
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a list of file attachments and a repository link. It formats the file sizes,
   * binds a click handler to resolve downloads, and truncates filenames for consistent display.
   *
   * PARAMETERS:
   * - props (ProjectResourcesCardProps): Properties containing the files list and repo link.
   *
   * RETURNS:
   * - React.JSX.Element: The project resources card.
   */
  const cleanGitLink = (githubLink ?? '').replace("https://", "")

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8e1df]">
          Project_Resources
        </span>
        <span className="material-symbols-outlined text-xs text-[#00e0b3]">folder_open</span>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* GitHub Link */}
        {githubLink && (
          <div className="flex flex-col gap-2">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
              Source_Repository
            </span>
            <a
              href={githubLink}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between border border-white/10 hover:border-[#00e0b3]/30 bg-[#151312]/40 px-4 py-3 rounded-sm text-xs font-mono text-[#e8e1df] hover:text-[#00e0b3] transition-colors cursor-pointer group"
            >
              <span className="truncate">{cleanGitLink}</span>
              <span className="material-symbols-outlined text-xs shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                open_in_new
              </span>
            </a>
          </div>
        )}

        {/* Submitted files list */}
        <div className="flex flex-col gap-2">
          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
            Node_Payload_Assets
          </span>
          {projectFiles && projectFiles.length > 0 ? (
            <div className="flex flex-col gap-2">
              {projectFiles.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => handleDownloadFile(file?.storage_path ?? null)}
                  className="w-full flex items-center justify-between border border-white/5 bg-[#151312]/40 px-4 py-3 rounded-sm hover:border-[#00e0b3]/20 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-sm text-[#83958d] group-hover:text-[#00e0b3] transition-colors shrink-0">
                      insert_drive_file
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono text-[#e8e1df] truncate">
                        {file.original_file_name}
                      </span>
                      {file.size && (
                        <span className="text-[8px] font-mono text-[#83958d] uppercase mt-0.5">
                          {(file.size / (1024 * 1024)).toFixed(1)}_MB
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-xs text-[#83958d] group-hover:text-[#00e0b3] transition-colors shrink-0 ml-2">
                    download
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[9px] font-mono text-[#83958d] italic">
              No assets uploaded for this payload.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
