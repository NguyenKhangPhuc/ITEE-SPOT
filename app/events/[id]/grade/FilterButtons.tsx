interface FilterButtonProps {
    chosenSubmissionFilter: 'all' | 'top3' | 'star' | null
    getAllSubmission: () => void
    getTop5Submsission: () => void
    getSubmissionBaseOnStar: (star: number) => void
}

const FilterButton = ({ chosenSubmissionFilter, getAllSubmission, getTop5Submsission, getSubmissionBaseOnStar }: FilterButtonProps) => {
    return (
        <>
            <div className="w-full flex gap-5">
                <button className={`duration-300 cursor-pointer ${chosenSubmissionFilter == 'all' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${chosenSubmissionFilter == 'all' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => getAllSubmission()}
                >
                    All Evaluation Result
                </button>
                <button className={`duration-300 cursor-pointer ${chosenSubmissionFilter == 'top3' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${chosenSubmissionFilter == 'top3' ? 'bg-black' : 'bg-white'} 
                     hover:scale-102 rounded-[10px] flex items-center justify-center  sm:text-[13px] text-[8px]`}
                    onClick={() => getTop5Submsission()}
                >
                    Top 5 Evaluation Result
                </button>
            </div>
            <select
                defaultValue={""}
                onChange={(e) => getSubmissionBaseOnStar(parseInt(e.target.value))}
                className={`duration-300 cursor-pointer ${chosenSubmissionFilter === 'star' ? 'text-white bg-black' : 'text-black bg-white'
                    } text-center border-4 border-black rounded-[10px] p-3  sm:text-[13px] text-[10px]`}
            >
                <option value="" disabled>
                    Choose an option
                </option>

                <option value="5">Rated 5 Star</option>
                <option value="4">Rated 4 Star</option>
                <option value="3">Rated 3 Star</option>
                <option value="2">Rated 2 Star</option>
                <option value="1">Rated 1 Star</option>
            </select>
        </>
    )
}

export default FilterButton