
const FixedYoutubeVideo = ({ embeddedUrl }: { embeddedUrl: string }) => {

    return (
        <div className="w-full ">
            {embeddedUrl != null && embeddedUrl != "" ? <iframe
                width="100%"
                height="500"
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

export default FixedYoutubeVideo