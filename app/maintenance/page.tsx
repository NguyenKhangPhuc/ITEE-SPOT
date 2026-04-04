const Home = () => {
    return (
        <div className="fixed inset-0 z-[9999] w-full h-screen flex justify-center items-center screen-bg backdrop-blur-md flex-col">
            <div className="dino-loader">
                <div className="dino-runner"></div>
                <div className="dino-obstacle"></div>
                <div className="dino-ground"></div>
            </div>

            <div className="text-xl text-color mt-5 font-roboto-mono">Sorry, please comeback later, we are under maintenance</div>
        </div>
    )
}

export default Home