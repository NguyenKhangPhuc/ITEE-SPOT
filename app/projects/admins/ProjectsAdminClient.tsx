'use client'
import { getAllProjectsBasedOnStatus, updateProjectStatus } from "@/app/actions/projects"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { PROJECT_STATUS } from "@/app/types/enum"
import { ProjectsSummary } from "@/app/types/projects"
import Link from "next/link"
import { useState } from "react"

const ProjectsAdminClient = ({ projects }: { projects: Array<ProjectsSummary> | null }) => {
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const [currentProjects, setCurrrentProjects] = useState(projects)
    const [chosenStatus, setChosenStatus] = useState<PROJECT_STATUS | null>(null)
    const [chosenOrder, setChosenOrder] = useState<boolean>(false)
    const handleGettingStatusColor = (status: string | null) => {
        switch (status) {
            case PROJECT_STATUS.ACCEPTED:
                return 'text-green-500'
            case PROJECT_STATUS.PENDING:
                return 'text-yellow-600'
            case PROJECT_STATUS.REJECTED:
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    const handleUpdatingProjectsStatus = async ({ projectId, status }: { projectId: string, status: PROJECT_STATUS }) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await updateProjectStatus({ projectId, status })
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error('Fail to fetch updated data')
            }
            const updatedProjects = currentProjects?.map((project) => {
                if (project.id == data?.id) {
                    return data
                }

                return project
            }) ?? []
            console.log(data)
            console.log(currentProjects)
            setCurrrentProjects(updatedProjects)
            setIsOpenLoader(false)
            showNotification('Update project status successfully')
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleFilterProjectStatus = async (status: PROJECT_STATUS | null) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getAllProjectsBasedOnStatus({ status, ascending: chosenOrder })
            if (error) {
                throw new Error(error)
            }

            setCurrrentProjects(data ?? [])
            setChosenStatus(status)
            setIsOpenLoader(false)
            showNotification("Filter successfully")
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleFilterProjectOrder = async (ascending: boolean) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getAllProjectsBasedOnStatus({ status: chosenStatus, ascending })
            if (error) {
                throw new Error(error)
            }
            setCurrrentProjects(data ?? [])
            setChosenOrder(ascending)
            setIsOpenLoader(false)
            showNotification("Filter successfully")
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }


    return (
        <div className="w-full bg-white p-5 rounded-xl mt-5">
            <div className="w-full overflow-x-auto border-4 border-black rounded-[10px] text-sm">
                <div className="w-full flex justify-between items-center">
                    <div className="text-lg  text-black p-2">All Projects <span className="text-xs font-normal opacity-70"></span></div>
                    <div className="flex items-center gap-5 p-2">
                        <select
                            onChange={(e) => {
                                const val = e.target.value;

                                handleFilterProjectStatus(val === "" ? null : (val as PROJECT_STATUS));
                            }}
                            value={chosenStatus ?? ""}
                            className="event_input outline-none w-50 h-[35px] bg-white border-2 border-black rounded px-2 cursor-pointer "
                        >
                            <option value="">All</option>
                            {Object.values(PROJECT_STATUS).map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                        <select
                            onChange={(e) => handleFilterProjectOrder(e.target.value === "true")}
                            value={chosenOrder.toString()}
                            className="event_input outline-none w-50 h-[35px] bg-white border-2 border-black rounded px-2 cursor-pointer "
                        >
                            <option value="false">Newest First (Descending)</option>
                            <option value="true">Oldest First (Ascending)</option>
                        </select>
                    </div>
                </div>
                <table className="w-full min-w-max border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="w-50  p-4 border-r border-white border-b-4 border-b-black text-left">Event</th>
                            <th className="w-50  p-4 border-r border-white border-b-4 border-b-black text-left">Group</th>
                            <th className="w-50  p-4 border-r border-white border-b-4 border-b-black text-left">Project</th>
                            <th className="w-30 p-1 border-r border-white border-b-4 border-b-black text-center">Status</th>
                            <th className="w-50  0  p-4 border-r border-white border-b-4 border-b-black text-center">Choose status</th>
                            <th className="w-50  p-4 border-r border-white border-b-4 border-b-black text-center">View / Preview</th>

                        </tr>
                    </thead>

                    <tbody>
                        {currentProjects?.map((item, index) => (
                            <tr key={item.id || index} className={` duration-300 border-b-2 border-black last:border-b-0 `}

                            >
                                <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                    {item.groups?.events?.title || "No Title"}
                                </td>
                                <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                    {item.groups?.group_name || "No group name"}
                                </td>
                                <td className="p-4 border-r-2 border-black  font-semibold text-sm text-left">
                                    {item.project_title}
                                </td>

                                <td className={`p-1 border-r-2 border-black  font-semibold text-sm text-center ${handleGettingStatusColor(item?.project_status)}`}>
                                    {item.project_status}
                                </td>


                                <td className="p-3 border-r-2 border-black font-semibold text-sm">
                                    <div className="input-group w-full text-left">
                                        <select
                                            onChange={(e) => handleUpdatingProjectsStatus({ projectId: item.id!, status: e.target.value as PROJECT_STATUS })}
                                            defaultValue={item.project_status ?? PROJECT_STATUS.PENDING}
                                            className="event_input outline-none w-full h-[40px] bg-white border-2 border-black rounded px-2 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={PROJECT_STATUS.PENDING}>Pending</option>
                                            <option value={PROJECT_STATUS.ACCEPTED}>Accept</option>
                                            <option value={PROJECT_STATUS.REJECTED}>Reject</option>
                                        </select>
                                    </div>
                                </td>
                                <td className={`p-1 border-r-2 border-black  font-semibold text-sm text-center`}>
                                    <Link href={`${item.project_status == PROJECT_STATUS.ACCEPTED ? `projects/${item.id}` : `projects/${item.id}/pending`}`} className="text-blue-500 border-b border-blue-500">
                                        View details
                                    </Link>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjectsAdminClient