const YoutubeVideo = ({ embeddedUrl }: { embeddedUrl: string }) => {
    console.log('This is youtube link ' + embeddedUrl)
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