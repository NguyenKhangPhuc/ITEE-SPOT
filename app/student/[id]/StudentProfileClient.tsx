import { ProfileInsert } from "@/app/types/profile"
import { createClient } from "@/app/utils/supabase/client"
import Image from 'next/image'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import { DEGREE } from "@/app/types/enum";
import { ProjectsSummaryExtended } from "@/app/types/projects";
import ProjectsSection from "@/app/projects/ProjectsSection";



const StudentProfileClient = ({ user, userProjects }: { user: ProfileInsert, userProjects: Array<ProjectsSummaryExtended> }) => {
    const supabase = createClient()
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);
        return data.publicUrl;
    }

    const degreeLabel: Record<DEGREE, string> = {
        Bachelor: "B.Sc",
        Master: "M.Sc",
        "Ph.D": "Ph.D",
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible">
                <div className="relative h-28 xl:h-36 rounded-t-2xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500" />

                <div className="relative px-5 pb-6 pt-0">
                    <div className="flex items-start justify-between">
                        <div className="absolute z-10 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200
                                top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                                xl:top-1/2 xl:left-0 xl:-translate-y-1/2 xl:-translate-x-20">
                            <div className="relative w-full h-full rounded-full 
                                                         flex items-center justify-center cursor-pointer bg-gray-300">
                                {user.avatar_url ? (
                                    <Image
                                        src={handleGetUrl(user.avatar_url)}
                                        alt="Avatar"
                                        width={200}
                                        height={200}
                                        sizes="200px"
                                        className="object-cover rounded-full "
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    <div className="mt-20 xl:mt-4 xl:pl-28">
                        {/* Name + Degree */}
                        <div className="flex flex-wrap items-center gap-2">
                            {user.full_name && (
                                <h1 className="text-2xl xl:text-3xl font-bold text-slate-800 leading-tight">
                                    {user.full_name}
                                </h1>
                            )}
                            {user.degree && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                    {degreeLabel[user.degree] ?? user.degree}
                                </span>
                            )}
                            <div className="sm:ml-auto sm:mt-3 flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                {user.university && (
                                    <>
                                        <SchoolIcon />
                                        <span className="leading-tight">{user.university}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Job Title · Company Unit · Company Name */}
                        {(user.job_title || user.company_unit || user.company_name) && (
                            <p className="mt-1 text-sm text-slate-500 flex flex-wrap items-center gap-1">
                                {user.job_title && <span className="font-medium text-slate-600">{user.job_title}</span>}
                                {user.job_title && (user.company_unit || user.company_name) && (
                                    <span className="text-black text-lg">·</span>
                                )}
                                {user.company_unit && <span>{user.company_unit}</span>}
                                {user.company_unit && user.company_name && (
                                    <span className="text-black text-lg">·</span>
                                )}

                                {user.company_name && (
                                    <span className="font-semibold text-slate-700">{user.company_name}</span>
                                )}
                            </p>
                        )}


                        {user.programme && (
                            <p className="mt-0.5 text-xs text-slate-400 italic">{user.programme} - {user.year}</p>
                        )}

                        {user.description && (
                            <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                {user.description}
                            </p>
                        )}

                        {(user.github || user.linkedIn || user.email) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {user.email && (
                                    <a
                                        href={`mailto:${user.email}`}
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
                                    >
                                        {user.email}
                                    </a>
                                )}
                                {user.github && (
                                    <a
                                        href={user.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors font-medium"
                                    >
                                        <GitHubIcon /> GitHub
                                    </a>
                                )}
                                {user.linkedIn && (
                                    <a
                                        href={user.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors font-medium"
                                    >
                                        <LinkedInIcon /> LinkedIn
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div className="w-full flex flex-col gap-5">
                <ProjectsSection projects={userProjects} title={`${user.full_name}'s Projects`} />
            </div>
        </div>
    )
}

export default StudentProfileClient
