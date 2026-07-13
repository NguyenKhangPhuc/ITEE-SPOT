'use client'
import Link from "next/link";
import { AWARD_TYPE } from "../types/enum";
import { ProjectsSummary, ProjectsSummaryExtended } from "../types/projects"
import ProjectsSection from "./ProjectsSection";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ProjectFilter } from "../types/group";
import { EventInsert } from "../types/event";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
const ProjectsClient = ({ projects, events }: { projects: Array<ProjectsSummaryExtended> | null, events: Array<EventInsert> }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [currentProjects, setCurrentProjects] = useState(projects)
    const { register, handleSubmit, reset } = useForm<ProjectFilter>({
        defaultValues: {
            events: []
        }
    });
    console.log(currentProjects)
    const generalProject = currentProjects?.filter((pro) => {
        if (pro.project_awards[0] == null) {
            return true
        }
        return pro.project_awards[0]?.event_awards?.award_type == AWARD_TYPE.GENERAL
    })

    const specificProjects = currentProjects?.filter((pro) => {
        return pro.project_awards[0]?.event_awards?.award_type == AWARD_TYPE.SPECIFIC
    })
    const participantsProjects = currentProjects?.filter((pro) => {
        return pro.project_awards[0]?.event_awards?.award_type == AWARD_TYPE.PARTICIPANT
    })

    const onSubmit = (data: ProjectFilter) => {
        if (data.events.length == 0) {
            setCurrentProjects(projects)
        } else {
            const filteredProjects = projects?.filter((project) => {
                const matchEvents = data.events.length === 0 ? true :
                    data.events.includes(project.groups?.event_id ?? "")

                // const matchDegree = data.degrees.length === 0 ? true :
                //     group.group_members.some((mem) => data.degrees.includes(mem.profiles?.degree ?? ""));

                // const matchProgramme = data.programmes.length === 0 ? true :
                //     group.group_members.some((mem) => data.programmes.includes(mem.profiles?.programme ?? ""));

                // return matchChallenge && matchDegree && matchProgramme;
                return matchEvents;
            }) ?? []

            setCurrentProjects(filteredProjects)

        }
        setIsOpen(false);
    };
    const handleResetFilter = () => {
        reset()
        setCurrentProjects(projects)
        setIsOpen(false)
    }
    return (
        <div className="w-full flex flex-col gap-6 pt-5">
            <button
                onClick={() => setIsOpen(true)}
                className="w-40 h-10 bg-black text-white border-4 border-white rounded-xl 
                cursor-pointer hover:bg-white hover:text-black duration-300 flex gap-5 items-center justify-center font-bold"
            >
                Filter
                <FilterAltIcon />
            </button>
            {isOpen && <div className="flex flex-col fixed min-h-screen inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm max-h-[600px]">

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white flex flex-col h-[400px] max-h-[600px] w-[100%] max-w-2xl p-6 rounded-xl shadow-2xl relative"
                >

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="cursor-pointer absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ClearIcon />
                    </button>

                    <h2 className="text-xl font-bold mb-6">Filter</h2>

                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="mb-6">
                            <label className="block font-semibold mb-3 text-gray-700">Events</label>
                            <div className="flex flex-wrap gap-4">
                                {events.map((event) => (
                                    <div key={event.id} className="flex items-center gap-2">
                                        <label className="checkbox_container">
                                            <input
                                                type="checkbox"
                                                value={event.id ?? ""}
                                                {...register('events')}
                                            />
                                            <div className="checkmark"></div>
                                        </label>
                                        <span className="text-sm">{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="pt-4 border-t border-gray-300 flex justify-end gap-3 mt-auto">
                        <button
                            type="button"
                            onClick={() => handleResetFilter()}
                            className="px-4 py-2 text-sm font-medium text-black hover:opacity-70 border-4 border-black rounded-xl duration-300 cursor-pointer"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-black/80 duration-300 cursor-pointer"
                        >
                            Apply Filter
                        </button>
                    </div>
                </form>
            </div>}
            {projects?.length == 0 && <div className="w-full flex justify-center text-white/70">No projects published yet</div>}
            <ProjectsSection projects={generalProject ?? []} title="General Awards" />
            <ProjectsSection projects={specificProjects ?? []} title="Specific Awards" />
            <ProjectsSection projects={participantsProjects ?? []} title="Participants" />

            {/* <ProjectsSection projects={projects ?? []} title="Participants" /> */}
        </div>
    )
}

export default ProjectsClient
