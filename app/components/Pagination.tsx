interface PaginationProps {
    totalPages: number | undefined,
    handleChoosePage: (page: number) => Promise<void>
    chosenPage: number
}

const Pagination = ({ totalPages, handleChoosePage, chosenPage }: PaginationProps) => {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: totalPages ?? 0 }, (_, i) => i + 1).map((page, index) => {
                const isFirst = page === 1;
                const isLast = page === totalPages;
                const isAdjacent = Math.abs(page - chosenPage) <= 1;

                if (isFirst || isLast || isAdjacent) {
                    return (
                        <button
                            key={page}
                            onClick={() => handleChoosePage(page)}
                            className={`w-10 h-10 border border-black flex items-center 
                                            justify-center transition-colors duration-300 font-medium cursor-pointer
                                                ${page === chosenPage
                                    ? "bg-[#8a715f] text-white rounded-xl"
                                    : "bg-white text-black hover:bg-[#8a715f] hover:text-white hover:rounded-xl"}
                                        `}
                        >
                            {page}
                        </button>
                    );
                }


                if (
                    (page === chosenPage - 2 && page > 1) ||
                    (page === chosenPage + 2 && page < (totalPages ?? 0))
                ) {
                    return (
                        <span key={page} className="w-10 h-10 flex items-center justify-center text-black font-bold">
                            ...
                        </span>
                    );
                }

                return null;
            })}
        </div>
    )
}

export default Pagination