import { getSingleProject } from "@/app/actions/projects/get/getSingleProject"
import SingleProjectClient from "./SingleProjectClient"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Home({ params }: PageProps) {
    const { id } = await params
    const { data: project, error } = await getSingleProject({ projectId: id })
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500 font-mono">Something went wrong: {error}</div>
    }

    return (
        <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono">
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col gap-6">
                <SingleProjectClient project={project!} />
            </div>
        </div>
    )
}