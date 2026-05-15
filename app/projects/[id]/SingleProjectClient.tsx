import { EVENT_STATUS, AWARD_TYPE } from "@/app/types/enum";
import { SingleProject } from "@/app/types/projects";
import { createClient } from "@/app/utils/supabase/client";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor";
import Image from "next/image";
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YoutubeVideo from "@/app/components/YoutubeVideo";
import FixedYoutubeVideo from "@/app/components/FixedYoutubeVideo";
import SubmissionFiles from "@/app/submission/[groupId]/read-only/SubmissionFiles";
const SingleProjectClient = ({ project }: { project: SingleProject }) => {
    const supabase = createClient();

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case EVENT_STATUS.ONGOING: return 'text-green-600';
            case EVENT_STATUS.FINISHED: return 'text-red-500';
            default: return 'text-gray-600';
        }
    };

    const getAwardColor = (type: string) => {
        switch (type) {
            case AWARD_TYPE.GENERAL:
            case AWARD_TYPE.SPECIFIC:
                return '#e94822';
            case AWARD_TYPE.PARTICIPANT:
                return '#2f43ba';
            default:
                return '#858585';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };
    const handleGetEmbeddedUrl = () => {
        try {

            const urlObj = new URL(project.youtube_link ?? "");
            let videoId = "";

            if (urlObj.hostname.includes("youtube.com")) {
                videoId = urlObj.searchParams.get("v")!;
            } else if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.slice(1);
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (e) {
            return null;
        }
    }


    return (
        <div className="w-full mt-10 flex flex-col gap-8 bg-white p-8  font-roboto-mono ">

            <div className=" rounded-xl  flex flex-col gap-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-gray-50 items-center">
                    <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                        {project.groups?.events?.title || "Unknown Event"}
                    </h1>
                    <div className={`font-bold uppercase text-sm ${getStatusColor(project.groups?.events?.status || "")}`}>
                        ● {project.groups?.events?.status}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <CalendarMonthIcon />
                        {formatDate(project.groups?.events?.start_date || null)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                        <CalendarMonthIcon />
                        {formatDate(project.groups?.events?.end_date || null)}
                    </div>
                </div>

                <div className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-start justify-center gap-10">

                    <div className="flex sm:flex-row flex-col justify-start items-center gap-4 ">
                        <h2 className="text-2xl font-bold text-black min-w-max">
                            Team: {project.groups?.group_name}
                        </h2>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium flex items-center">
                            {project.groups?.group_members?.length || 0} Members
                        </span>
                    </div>


                    <div className="flex gap-2">
                        {project.project_awards.map((award) => {
                            const awardColor = getAwardColor(award.event_awards?.award_type || "");

                            return (
                                <div
                                    key={`award-${award.award_id}`}
                                    style={{ color: awardColor }}
                                    className="award-card relative "
                                >
                                    <svg
                                        className="svg-icon"
                                        height="50"
                                        width="50"
                                        fill={awardColor}
                                        viewBox="0 0 100 100"
                                    >
                                        <path d="M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z" />
                                    </svg>

                                    <div className="award-title text-base pointer-events-none" >
                                        {award.event_awards?.award_title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>


                <p className="text-gray-600 italic leading-relaxed">
                    &quot;{project.groups?.events?.short_description}&quot;
                </p>
            </div>

            <hr className="border-t-1 border-black w-full" />

            <div className="flex flex-col gap-6">



                <div className="flex items-center justify-between gap-6 mt-4">
                    <h3 className="text-2xl font-black text-black ">
                        Project: {project.project_title}
                    </h3>
                    {project.github_link && (
                        <a href={project.github_link} className="hover:scale-110 duration-300  ">
                            <GitHubIcon sx={{ fontSize: '40px' }} />
                        </a>
                    )}

                </div>

                <p className="text-sm text-gray-700 font-medium max-w-5xl">
                    {project.short_description}
                </p>
                <FixedYoutubeVideo embeddedUrl={handleGetEmbeddedUrl() ?? ""} />
                <div className="flex flex-col gap-4 min-h-[600px] shadow-2xl p-8 w-full bg-white rounded-xl border border-gray-100">
                    <div className="prose prose-lg max-w-none">

                        <ReadOnlyEditor content={project.description || ""} />
                    </div>
                </div>
            </div>
            <SubmissionFiles submittedFiles={project.project_files} />
            <div className="mt-10">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black uppercase tracking-widest">
                    Meet the Team
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.groups?.group_members?.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-xl shadow-xl/30 border border-gray-50 hover:-translate-y-1 duration-300">
                            <div className="flex flex-col gap-3">
                                <p className="text-2xl font-black text-black uppercase border-b-2 border-black pb-2">
                                    {member.profiles?.full_name || "No full name"}
                                </p>

                                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">

                                        {member.profiles?.email}
                                    </div>
                                    <div className="flex items-center gap-2">

                                        {member.profiles?.university || "Empty"}
                                    </div>
                                    <div className="flex items-center gap-2">

                                        {member.profiles?.degree || 'Empty'} - (Year: {member.profiles?.year || 'Empty'})
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-2">
                                    {member.profiles?.github && (
                                        <a href={member.profiles.github} target="_blank" className="text-xl duration-300 hover:translate-y-1">
                                            <GitHubIcon />
                                        </a>
                                    )}
                                    {member.profiles?.linkedIn && (
                                        <a href={member.profiles.linkedIn} target="_blank" className="text-xl duration-300 hover:translate-y-1">
                                            <LinkedInIcon />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SingleProjectClient;