import YoutubeVideo from "@/app/components/YoutubeVideo"
import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants"
import { SubmissionInsert } from "@/app/types/submission"
import { register } from "module"
import { UseFormRegister, FieldErrors } from "react-hook-form"

interface SubmissionBasicInfo {
    register: UseFormRegister<SubmissionInsert>
    errors: FieldErrors<SubmissionInsert>,
    handleGetEmbeddedUrl: () => string | null,
    descriptionValue: string | null | undefined,
}
const SubmissionBasicInfo = ({ register, errors, handleGetEmbeddedUrl, descriptionValue }: SubmissionBasicInfo) => {
    return (
        <>
            <div className="input-group w-full">
                <label className="event_input_label">Project title</label>
                <input autoComplete="off" placeholder="Project Title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                    {...register('title', {
                        required: "Project title is required",
                    })} />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>
            <div className="input-group w-full">
                <label className="event_input_label">Github Link</label>
                <input autoComplete="off" placeholder="Github source code link" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

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
                <input autoComplete="off" placeholder="Demo video link" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                    {...register('youtube_link')} />
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
                    maxLength={SHORT_DESCRIPTION_LENGTH}
                    autoComplete="off"
                    placeholder="Short Description"
                    className="event_input outline-none w-full placeholder:font-bold h-[80px]"
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
                    <span style={{ color: (descriptionValue?.length ?? 0) >= SHORT_DESCRIPTION_LENGTH ? 'red' : 'gray' }}>
                        {descriptionValue?.length ?? 0}
                    </span>
                    /{SHORT_DESCRIPTION_LENGTH} Characters
                </div>
            </div>
        </>
    )
}

export default SubmissionBasicInfo