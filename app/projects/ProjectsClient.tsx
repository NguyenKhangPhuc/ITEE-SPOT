'use client'
import Link from "next/link";
import { AWARD_TYPE, EVENT_STATUS, PROJECT_STATUS } from "../types/enum";
import { ProjectsSummary, ProjectsSummaryExtended } from "../types/projects"
import ProjectsSection from "./ProjectsSection";

const ProjectsClient = ({ projects }: { projects: Array<ProjectsSummaryExtended> | null }) => {

    const generalProject = projects?.filter((pro) => {
        if (pro.project_awards[0] == null) {
            return true
        }
        return pro.project_awards[0]?.event_awards?.award_type == AWARD_TYPE.GENERAL
    })
    const specificProjects = projects?.filter((pro) => {
        return pro.project_awards[0]?.event_awards?.award_type == AWARD_TYPE.SPECIFIC
    })
    const participantsProjects = projects?.filter((pro) => {
        return pro.project_awards[0]?.event_awards?.award_type == AWARD_TYPE.PARTICIPANT
    })

    return (
        <div className="w-full flex flex-col gap-6 pt-5">
            {projects?.length == 0 && <div className="w-full flex justify-center text-white/70">No projects published yet</div>}
            <ProjectsSection projects={generalProject ?? []} title="General Awards" />
            <ProjectsSection projects={specificProjects ?? []} title="Specific Awards" />
            <ProjectsSection projects={participantsProjects ?? []} title="Participants | Audience Favorite" />

            {/* <ProjectsSection projects={projects ?? []} title="Participants" /> */}
        </div>
    )
}

export default ProjectsClient
