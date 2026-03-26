
export default function LoadingComponent() {
    return (
        <div className="fixed inset-0 z-[9999] w-full h-screen flex justify-center items-center screen-bg backdrop-blur-md">

            <div className="wrapper relative scale-125">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
            </div>
        </div>
    )
}