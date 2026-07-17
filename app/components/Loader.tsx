'use client'
import { useLoader } from "../context/LoaderContext"

const Loader = () => {
    const { isOpenLoader } = useLoader()
    if (isOpenLoader == false) {
        return null
    }
    return (
        <div className="fixed inset-0 z-[9999] w-full h-screen flex justify-center items-center bg-black/20 backdrop-blur-md">

            <div className="loader"></div>
        </div>
    )
}

export default Loader