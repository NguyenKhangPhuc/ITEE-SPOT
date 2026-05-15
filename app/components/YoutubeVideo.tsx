'use client'

import { Control, useWatch } from "react-hook-form"

const YoutubeVideo = ({ control }: { control: Control }) => {
    const youtubeLink = useWatch({ name: "youtube_link", control })

    const handleGetEmbeddedUrl = () => {
        if (!youtubeLink) return ""
        const match = youtubeLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        return match ? `https://www.youtube.com/embed/${match[1]}` : ""
    }
    const embeddedUrl = handleGetEmbeddedUrl()
    return (
        <div className="w-full ">
            {embeddedUrl != null && embeddedUrl != "" ? <iframe
                width="100%"
                height="315"
                src={embeddedUrl ?? ""}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            >
            </iframe> : <></>}
        </div>
    )
}




export default YoutubeVideo