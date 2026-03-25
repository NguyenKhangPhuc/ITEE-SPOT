'use client'

import YoutubeVideo from "@/app/components/YoutubeVideo";
import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface SubmissionInfoProps {
    register: UseFormRegister<{
        created_at?: string;
        description?: string | null;
        github_link?: string | null;
        group_challenge_id?: string | null;
        group_id?: string | null;
        id?: string;
        short_description?: string | null;
        youtube_link?: string | null;
    }>
    errors: FieldErrors<{
        created_at?: string;
        description?: string | null;
        github_link?: string | null;
        group_challenge_id?: string | null;
        group_id?: string | null;
        id?: string;
        short_description?: string | null;
        youtube_link?: string | null;
    }>
    handleGetEmbeddedUrl: () => string | null
    initialContent: string
    descriptionValue: string
}

const SubmissionInfo = ({ register, errors, handleGetEmbeddedUrl, initialContent, descriptionValue }: SubmissionInfoProps) => {

    return (
        <>
            <div className="input-group w-full">
                <label className="event_input_label">Github Link</label>
                <input autoComplete="off" placeholder="Github source code link" id="Title"
                    className="event_input outline-none w-full  h-[40px] placeholder:font-bold cursor-not-allowed" type="text"
                    disabled
                    {...register('github_link', {
                        required: "Github link is required",
                    })} />
                {errors.github_link && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.github_link.message}
                    </p>
                )}
            </div>
            <div className="input-group w-full">
                <label className="event_input_label">Youtube Link</label>
                <input autoComplete="off" placeholder="Demo video link" id="Title"
                    className="event_input outline-none w-full  h-[40px] placeholder:font-bold cursor-not-allowed" type="text"
                    disabled
                    {...register('youtube_link', {
                        required: "Youtube link is required",
                    })} />
                {errors.youtube_link && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.youtube_link.message}
                    </p>
                )}
            </div>
            <YoutubeVideo embeddedUrl={handleGetEmbeddedUrl() ?? ""} />
            <div className="input-group w-full ">
                <label className="event_input_label">Short Description</label>
                <textarea
                    disabled
                    autoComplete="off"
                    placeholder="Short Description"
                    className="event_input outline-none w-full placeholder:font-bold h-[80px] cursor-not-allowed"
                    {...register('short_description', {
                        required: "Short description is required",
                    })}
                />
                {errors.short_description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.short_description.message}
                    </p>
                )}
                <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '14px' }}>
                    <span style={{ color: descriptionValue.length >= SHORT_DESCRIPTION_LENGTH ? 'red' : 'gray' }}>
                        {descriptionValue.length}
                    </span>
                    /{SHORT_DESCRIPTION_LENGTH} Characters
                </div>
            </div>
            <div className="flex flex-col gap-4 h-[800px] shadow shadow-xl p-5">
                <ReadOnlyEditor content={initialContent} />
            </div>

        </>
    )
}


export default SubmissionInfo