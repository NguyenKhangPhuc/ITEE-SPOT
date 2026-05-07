'use client'
import Link from "next/link";
import { AWARD_TYPE, EVENT_STATUS, PROJECT_STATUS } from "../types/enum";
import { ProjectsSummary, ProjectsSummaryExtended } from "../types/projects"
import { createClient } from "../utils/supabase/client";
import Image from 'next/image'
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useLoader } from "../context/LoaderContext";
import Pagination from "../components/Pagination";
import { getAllProjectsBasedOnStatus } from "../actions/projects";
import ProjectsSection from "./ProjectsSection";
import { mockProjects } from "../constants";

const ProjectsClient = ({ projects }: { projects: Array<ProjectsSummaryExtended> | null }) => {
    const generalProject = mockProjects?.filter((pro) => {
        return pro.project_awards[0].event_awards.award_type == AWARD_TYPE.GENERAL
    })
    const specificProjects = mockProjects?.filter((pro) => {
        return pro.project_awards[0].event_awards.award_type == AWARD_TYPE.SPECIFIC
    })
    const participantsProjects = mockProjects?.filter((pro) => {
        return pro.project_awards[0].event_awards.award_type == AWARD_TYPE.PARTICIPANT
    })



    return (
        <div className="w-full flex flex-col gap-6 pt-5">
            <ProjectsSection projects={generalProject ?? []} title="General Awards" />
            <ProjectsSection projects={specificProjects ?? []} title="Specific Awards" />
            <ProjectsSection projects={participantsProjects ?? []} title="Participants" />


        </div>
    )
}

export default ProjectsClient
