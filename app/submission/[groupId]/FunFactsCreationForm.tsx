'use client'
import { EventChallengeInsert } from "@/app/types/event_challenges";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';
import { FunFactsInsert } from "@/app/types/funfacts";


const FunFactsCreationForm = ({ funfacts, setFunFacts }: { funfacts: Array<FunFactsInsert>, setFunFacts: React.Dispatch<SetStateAction<Array<FunFactsInsert>>> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FunFactsInsert>()


    const handleCreateNewFunFact = (funfact: FunFactsInsert) => {
        if (!funfact.fact || funfact.fact?.length == 0) {
            setFunFacts([])
            return;
        }
        setFunFacts([...funfacts, funfact])
        reset({
            fact: ""
        });
    }
    const handleDeleteFunFacts = (index: number) => {
        setFunFacts(prev => prev.filter((_, i) => i !== index))
    }


    return (
        <div className="flex w-full flex-col gap-2">
            <div className="w-full flex gap-5">
                <div className="input-group w-full">
                    <label className="event_input_label">Fun Facts (Optional)</label>
                    <input autoComplete="off" placeholder="Challenge title" id="Title" className="event_input outline-none w-full  h-[40px] placeholder:font-bold " type="text"

                        {...register('fact')} />
                    {errors.fact && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.fact.message}
                        </p>
                    )}
                </div>
            </div>
            {funfacts.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                    {funfacts.map((funfact, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-md"
                        >
                            <span className="font-semibold">{funfact.fact}</span>

                            <button
                                type="button"
                                onClick={() => handleDeleteFunFacts(index)}
                                className="cursor-pointer hover:text-red-500"
                            >
                                <ClearIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button
                className="cursor-pointer w-auto px-2 py-2 rounded-md bg-black hover:bg-black/90 transition-colors duration-300 text-white"
                onClick={handleSubmit(handleCreateNewFunFact)}
                type="button"
            >
                Add/Save FunFacts (Optional)
            </button>
        </div>

    )
}

export default FunFactsCreationForm