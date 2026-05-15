import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants"
import { EditGroupInfo } from "@/app/types/group"
import { SetStateAction } from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"

interface GroupInfoProps {
    registerGroup: UseFormRegister<EditGroupInfo>
    disableGroupName: boolean,
    setDisableGroupName: React.Dispatch<SetStateAction<boolean>>
    groupErrors: FieldErrors<EditGroupInfo>,
    descriptionValue: string
}

const GroupInfoSection = ({
    registerGroup,
    disableGroupName,
    groupErrors,
    descriptionValue,
    setDisableGroupName
}: GroupInfoProps) => {
    return (
        <>
            <div className="w-full flex gap-3 ">
                <div className="input-group w-full">
                    <label className="event_input_label">Your group name</label>
                    <div className="w-full flex items-center gap-5">
                        <input placeholder="Project title" className={`event_input outline-none w-full h-[40px] font-bold ${disableGroupName ? 'cursor-not-allowed opacity-70' : ''}`} type="text"
                            disabled={disableGroupName}
                            {...registerGroup('groupName', {
                                required: "Group name is required",
                            })} />
                    </div>
                    {groupErrors.groupName && (
                        <p className="text-red-500 text-sm mt-1">
                            {groupErrors.groupName.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="input-group w-full ">
                <label className="event_input_label">Short Description</label>
                <textarea
                    maxLength={SHORT_DESCRIPTION_LENGTH}
                    disabled={disableGroupName}
                    autoComplete="off"
                    placeholder="Short Description -- Max 200 characters"
                    className={`event_input outline-none w-full placeholder:font-bold h-[80px] ${disableGroupName ? 'cursor-not-allowed opacity-70' : ''}`}
                    {...registerGroup('short_description', {
                        required: "Short description members is required",
                    })}
                />
                <div className="w-full flex justify-between">

                    {groupErrors.short_description && (
                        <p className="text-red-500 text-sm mt-1">
                            {groupErrors.short_description.message}
                        </p>
                    )}
                    <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '14px' }}>
                        <span style={{ color: descriptionValue.length >= SHORT_DESCRIPTION_LENGTH ? 'red' : 'gray' }}>
                            {descriptionValue.length}
                        </span>
                        /{SHORT_DESCRIPTION_LENGTH} Characters
                    </div>
                </div>
            </div>
            {disableGroupName == true && <button className={`bg-black px-10 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                type="button" onClick={() => setDisableGroupName(false)}
            >
                Edit
            </button>}
            {disableGroupName == false && <button className={`bg-black px-10 py-1 rounded-lg cursor-pointer h-full text-white hover:bg-black/80 duration-300`}
                type="submit"
            >
                Save
            </button>}
        </>
    )
}

export default GroupInfoSection