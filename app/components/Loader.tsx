'use client'
import { useLoader } from "../context/LoaderContext"

const Loader = () => {
    const { isOpenLoader } = useLoader()
    if (isOpenLoader == false) {
        return null
    }
    return (
        <div className="fixed inset-0 z-[9999] w-full h-screen flex justify-center items-center bg-black/20 backdrop-blur-md">

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

export default Loader