'use client'

import { Control, useWatch } from "react-hook-form"
import { SHORT_DESCRIPTION_LENGTH } from "../constants"

const WordCounter = ({ control }: { control: Control }) => {
    const descriptionValue = useWatch({ name: "short_description", control })
    return (
        <div style={{ textAlign: "right", marginTop: "5px", fontSize: "14px" }}>
            <span
                style={{
                    color:
                        (descriptionValue?.length ?? 0) >= SHORT_DESCRIPTION_LENGTH
                            ? "red"
                            : "gray",
                }}
            >
                {descriptionValue?.length ?? 0}
            </span>
            /{SHORT_DESCRIPTION_LENGTH} Characters
        </div>
    )
}

export default WordCounter