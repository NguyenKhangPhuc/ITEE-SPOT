import { PROGRAMME, DEGREE } from "@/app/types/enum"
import { EventWithChallenges } from "@/app/types/event"
import { Filter } from "@/app/types/group"
import { SetStateAction } from "react"
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
interface FilterComponentProp {
    handleSubmit: UseFormHandleSubmit<Filter, Filter>,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>
    register: UseFormRegister<Filter>
    event: EventWithChallenges,
    onSubmit: (data: Filter) => void,
    handleResetFilter: () => void
}
const FilterComponent = ({
    handleSubmit,
    setIsOpen,
    event,
    register,
    onSubmit,
    handleResetFilter
}: FilterComponentProp) => {



    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white overflow-x-auto min-h-[400px] max-h-[600px] w-[100%] max-w-2xl p-6 rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-300"
        >

            <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
                <ClearIcon />
            </button>

            <h2 className="text-xl font-bold mb-6">Filter</h2>

            <div className="mb-6">
                <label className="block font-semibold mb-3 text-gray-700">Challenges</label>
                <div className="flex flex-wrap gap-4">
                    {event.event_challenges.map((challenge) => (
                        <div key={challenge.id} className="flex items-center gap-2">
                            <label className="checkbox_container">
                                <input
                                    type="checkbox"
                                    value={challenge.title ?? ""}
                                    {...register('challenges')}
                                />
                                <div className="checkmark"></div>
                            </label>
                            <span className="text-sm">{challenge.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                    <label className="block font-semibold mb-3 text-gray-700">Programme</label>
                    <div className="space-y-2">
                        {Object.values(PROGRAMME).map((prog) => (
                            <div key={prog} className="flex items-start gap-3 w-full">
                                <div className="flex-shrink-0 mt-0.5">
                                    <label className="checkbox_container">
                                        <input
                                            type="checkbox"
                                            value={prog}
                                            {...register('programmes')}
                                        />
                                        <div className="checkmark"></div>
                                    </label>
                                </div>
                                <span className="text-sm break-words">{prog}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-3 text-gray-700">Degree</label>
                    <div className="space-y-2">
                        {Object.values(DEGREE).map((uni) => (
                            <div key={uni} className="flex items-center gap-2">
                                <label className="checkbox_container">
                                    <input
                                        type="checkbox"
                                        value={uni}
                                        {...register('degrees')}
                                    />
                                    <div className="checkmark"></div>
                                </label>
                                <span className="text-sm">{uni}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => handleResetFilter()}
                    className="px-4 py-2 text-sm font-medium text-black hover:opacity-70 border-4 border-black rounded-xl duration-300 cursor-pointer"
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-black text-color rounded-lg font-medium hover:bg-black/80 duration-300 cursor-pointer"
                >
                    Apply Filter
                </button>
            </div>
        </form>

    )
}

export default FilterComponent