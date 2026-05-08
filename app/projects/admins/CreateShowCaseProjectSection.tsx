'use client'

import { getSingleProjectByGroupAndChallenge } from "@/app/actions/projects"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventWithGroupsAndAward } from "@/app/types/event"
import { GroupWithChallenge } from "@/app/types/group"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert } from "@/app/types/projects"
import { useState } from "react"
import { useForm } from "react-hook-form"
import EditProjectFormSection from "../students/EditProjectFormSection"

const CreateShowCaseProjectSection = ({ eventsWithGroupsAndAwards, page }: { eventsWithGroupsAndAwards: Array<EventWithGroupsAndAward>, page: 'create' | 'manage' }) => {
    const [selectedEvent, setSelectedEvent] = useState<EventWithGroupsAndAward | null>(null)
    const [selectedGroup, setSelectedGroup] = useState<GroupWithChallenge | null>(null)
    const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string>("")
    const [submittedFiles, setSubmittedFiles] = useState<ProjectFileExtended[]>([])
    const [selectedAward, setSelectedAward] = useState<Array<ProjectAwardsInsert>>([])
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const {
        register,
        reset,
        formState: { errors },
        handleSubmit,
        control
    } = useForm<ProjectsInsert>()
    const handleSelectEvent = (eventId: string) => {
        if (!eventId) {
            setSelectedEvent(null)
            setSelectedGroup(null)
            setSelectedChallengeId(null)
            reset()
        }
        const event = eventsWithGroupsAndAwards.find((event) => event.id == eventId)!
        setSelectedEvent(event)
    }
    const handleGroupSelect = (groupId: string) => {
        if (!selectedEvent) {
            setSelectedEvent(null)
            setSelectedGroup(null)
            setSelectedChallengeId(null)
            reset()
        }
        const group = selectedEvent!.groups.find((group) => group.id == groupId)!
        setSelectedGroup(group)
    }

    const handleChallengeSelect = async (groupChallengeId: string) => {
        setSelectedChallengeId(groupChallengeId || null)

        if (selectedEvent && selectedGroup && groupChallengeId) {
            setIsOpenLoader(true)
            try {
                const { data, error } = await getSingleProjectByGroupAndChallenge({ group_id: selectedGroup.id, group_challenge_id: groupChallengeId })
                if (error) {
                    throw new Error(error)
                }
                setIsOpenLoader(false)
                console.log(data)
                if (data) {
                    reset(data)
                    setSubmittedFiles(data.project_files)
                    setSelectedAward(data.project_awards)
                    setInitialEditorContent(data.description ?? "")
                } else {
                    reset({
                        id: undefined,
                        github_link: "",
                        youtube_link: "",
                        short_description: "",
                        group_challenge_id: groupChallengeId,
                        group_id: selectedGroup.id,
                        created_at: undefined
                    })
                    setInitialEditorContent("")
                    setSelectedAward([])
                    setSubmittedFiles([])
                }
                showNotification("Select successfully")
            } catch (error) {
                setIsOpenLoader(false)
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }

        }
    }

    if (page != 'create') {
        return null
    }
    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex gap-5 w-full ">

                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">All Events</label>
                    <select
                        onChange={(e) => handleSelectEvent(e.target.value)}
                        defaultValue=""
                        className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2"
                    >
                        <option value="">Pick an option</option>
                        {eventsWithGroupsAndAwards.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.title ?? "Unnamed Event"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group w-1/2">
                    <label className="event_input_label block mb-1">Event&apos;s Groups</label>
                    <select
                        onChange={(e) => handleGroupSelect(e.target.value)}
                        defaultValue=""
                        disabled={selectedEvent == null}
                        className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">Pick an option</option>
                        {selectedEvent?.groups.map((g) => (
                            <option key={g.id ?? ""} value={g.id ?? ""}>
                                {g.group_name ?? "Unnamed Group"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="input-group w-full">
                <label className="event_input_label block mb-1">Event&apos;s Groups&apos;s Challenge</label>
                <select
                    onChange={(e) => handleChallengeSelect(e.target.value)}
                    defaultValue=""
                    disabled={selectedGroup == null}
                    className="event_input outline-none w-full h-[40px] bg-white border border-gray-300 rounded px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <option value="">Pick an option</option>
                    {selectedGroup?.group_challenge.map((g) => (
                        <option key={g.id ?? ""} value={g.id ?? ""}>
                            {g.event_challenges?.title ?? "Unnamed Group"}
                        </option>
                    ))}
                </select>
            </div>

            {selectedEvent && selectedGroup && selectedChallengeId && (
                <EditProjectFormSection
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    submittedFiles={submittedFiles}
                    setSubmittedFiles={setSubmittedFiles}
                    selectedAward={selectedAward}
                    setSelectedAward={setSelectedAward}
                    initialEditorContent={initialEditorContent}
                    setInitialEditorContent={setInitialEditorContent}
                    control={control}
                    eventAwards={selectedEvent.event_awards ?? []}
                />
            )}

        </div>
    )
}


export default CreateShowCaseProjectSection