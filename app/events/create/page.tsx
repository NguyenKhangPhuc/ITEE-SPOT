'use client'
import { createEvent } from "@/app/actions/events"
import { useNotification } from "@/app/context/NotificationContext"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Editor } from "@tiptap/core"
import { useRouter } from "next/navigation"
import { ChangeEvent, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
import { Event, EventInsert } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import Image from "next/image"
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"


const Home = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm<EventInsert>()

    const router = useRouter()
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const [editorValue, setEditorValue] = useState<Editor | null>(null)
    const [challenges, setChallenges] = useState<Array<EventChallengeInsert>>([])
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const handleCreateNewEvent = async (event: EventInsert) => {
        event.content = editorValue?.getHTML()
        setIsOpenLoader(true)
        try {
            const { data, error } = await createEvent({ event, challenges, avatarFile })
            if (error) {
                throw new Error(error)
            }
            if (data == null) {
                throw new Error('Cannot find created event')
            }
            setIsOpenLoader(false)
            showNotification("Create event successfully")
            router.push(`/events/${data.id}`)
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            } else {
                showNotification("Unknown error when create the event")
            }
            setIsOpenLoader(false)
        }
    }
    const handleFileChange = (file: File) => {
        if (file) {
            // Tạo Blob URL cho file vừa chọn
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setAvatarFile(file)
        }
    };

    const handleRemoveAvatarFile = () => {
        setPreviewUrl(null)
        setAvatarFile(null)
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 pt-5 pb-5">
                <form className="flex flex-col content-main-color mt-5 p-5 rounded-xl gap-5 items-start" onSubmit={handleSubmit(handleCreateNewEvent)}>
                    <div className="w-full flex flex-col items-center">
                        <div className="relative w-40 h-40 group">
                            <div className="relative w-full h-full rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition-all duration-300 bg-gray-50">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Avatar"
                                        width={200}
                                        height={200}
                                        sizes="200px"

                                        className="object-cover rounded-full "
                                    />
                                ) : (
                                    <div className="text-center p-2 text-xs text-gray-500 font-medium">
                                        Pick an image to show
                                    </div>
                                )}

                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            handleFileChange(files[0]);
                                        }
                                    }}
                                />
                            </div>

                            {previewUrl && (
                                <button
                                    onClick={() => handleRemoveAvatarFile()}
                                    className="w-5 h-5 flex items-center justify-center absolute top-3 right-3 bg-black text-white rounded-full shadow-lg 
                                 transition-colors z-20 cursor-pointer hover:bg-black/70 duration-300"
                                    type="button"
                                >
                                    <ClearIcon sx={{ fontSize: 16, color: 'white' }} />
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="w-full flex gap-5">
                        <div className="input-group w-full">
                            <label className="event_input_label">Title</label>
                            <input autoComplete="off" placeholder="Project title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                                {...register('title', {
                                    required: "Title is required",
                                })} />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 w-full">
                        <div className="input-group w-full">
                            <label className="event_input_label">Start Date</label>
                            <input autoComplete="off" placeholder="Start Date" id="StartDate"
                                className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="date"
                                {...register('start_date', {
                                    required: "Start date is required",
                                })}
                            />
                            {errors.start_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.start_date.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group w-full">
                            <label className="event_input_label">End Date</label>
                            <input autoComplete="off" id="EndDate" placeholder="End Date" className="event_input outline-none w-full  h-[40px] placeholder:font-bold" type="date"
                                {...register('end_date', {
                                    required: "End date is required",
                                })}
                            />
                            {errors.end_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.end_date.message}
                                </p>
                            )}
                        </div>

                        <div className="input-group w-full">
                            <label className="event_input_label">Location</label>
                            <input autoComplete="off" placeholder="Location" id="Location" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"
                                {...register('location', {
                                    required: "Location is required",
                                })}
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.location.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group w-full">
                            <label className="event_input_label">Organized Date</label>
                            <input autoComplete="off" id="OrganizedDate"
                                placeholder="Organized Date" className="event_input outline-none w-full  h-[40px] placeholder:font-bold" type="datetime-local"
                                {...register('organized_date', {
                                    required: "Organized Date is required",
                                })}
                            />
                            {errors.organized_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.organized_date.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="input-group w-full">
                        <label className="event_input_label">Max member per teams</label>
                        <input autoComplete="off" min="1"
                            step="1"
                            id="MaxMember"
                            placeholder="Max member per teams"
                            className="event_input outline-none w-[80px]  h-[40px] placeholder:font-bold"
                            type="number"
                            {...register('max_group_members', {
                                required: "Max group members is required",
                            })}
                        />
                        {errors.max_group_members && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.max_group_members.message}
                            </p>
                        )}
                    </div>

                    <ChallengeCreationForm challenges={challenges} setChallenges={setChallenges} />

                    <div className="input-group w-full ">
                        <label className="event_input_label">Short Description</label>
                        <textarea
                            autoComplete="off"
                            placeholder="Short Description"
                            className="event_input outline-none w-full placeholder:font-bold h-[80px]"
                            {...register('short_description', {
                                required: "Short description members is required",
                            })}
                        />
                        {errors.short_description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.short_description.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full shadow-xl/30 inset-shadow-sm rounded-xl ">
                        <SimpleEditor initialContent={null} onEditorReady={setEditorValue} limit={EVENT_CREATED_DESCRIPTION} />
                    </div>
                    <button
                        type="submit"
                        className="cursor-pointer px-6 py-2 rounded-md bg-black hover:bg-black/80 transition-colors duration-300 text-white"
                    >
                        Create New
                    </button>
                </form>
            </div>
        </div>
    )
}

const ChallengeCreationForm = ({ challenges, setChallenges }: { challenges: Array<EventChallengeInsert>, setChallenges: React.Dispatch<SetStateAction<Array<EventChallengeInsert>>> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EventChallengeInsert>()


    const handleCreateNewChallenge = (challenge: EventChallengeInsert) => {
        setChallenges([...challenges, challenge])
        reset({
            company_name: "",
            title: ""
        });
    }
    const handleDeleteChallenge = (index: number) => {
        setChallenges(prev => prev.filter((_, i) => i !== index))
    }


    return (
        <>
            <div className="w-full flex gap-5">
                <div className="input-group w-1/2">
                    <label className="event_input_label">Company</label>
                    <input autoComplete="off" placeholder="Company name" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                        {...register('company_name', {
                            required: "Company name for challenge is required",
                        })} />
                    {errors.company_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.company_name.message}
                        </p>
                    )}
                </div>
                <div className="input-group w-1/2">
                    <label className="event_input_label">Title</label>
                    <input autoComplete="off" placeholder="Challenge title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                        {...register('title', {
                            required: "Challenge title is required",
                        })} />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>
            </div>
            {challenges.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                    {challenges.map((challenge, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-md"
                        >
                            <span className="font-semibold">{challenge.title}</span>

                            <button
                                type="button"
                                onClick={() => handleDeleteChallenge(index)}
                                className="cursor-pointer hover:text-red-500"
                            >
                                <ClearIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button
                className="cursor-pointer px-6 py-2 rounded-md bg-black hover:bg-black/90 transition-colors duration-300 text-white"
                onClick={handleSubmit(handleCreateNewChallenge)}
                type="button"
            >
                Add challenge
            </button>
        </>

    )
}


export default Home