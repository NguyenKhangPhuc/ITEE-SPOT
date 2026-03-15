import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center layout px-4 text-center">

      <div className="flex flex-col items-center max-w-3xl">


        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-2">
          ITEE SKILLFORGE
        </h1>


        <p className="text-white/80 text-sm md:text-lg font-medium tracking-wide mb-8">
          powered by <span className="font-bold text-white">IKAPO project</span>
        </p>


        <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic mb-10">
          &quot;We&apos;re here to create <span className="text-white font-semibold">opportunity for students</span>,
          boost connection between <span className="text-white font-semibold">students and SMEs</span> in Oulu city.&quot;
        </p>


        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href={'#events'} className="cursor-pointer px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/5">
            Explore our event
          </Link>

          <Link href={'/login'} className="px-8 py-3 bg-white/20 text-white font-bold rounded-full border border-white/10 hover:bg-white/30 backdrop-blur-sm transition-all duration-300">
            Sign in
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 text-white/80 font-mono text-xs uppercase tracking-[0.5em]">
        Oulu City • Finland
      </div>
    </div>
  );
}
