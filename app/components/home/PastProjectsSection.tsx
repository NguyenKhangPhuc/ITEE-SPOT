'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { ProjectsSummaryExtended } from "../../types/projects"
import { createClient } from "../../utils/supabase/client"

/**
 * PURPOSE:
 * This component renders the Past Projects section of the Home page. It accepts the list of 
 * projects and renders the top 4 in a grid structure using Framer Motion animations. If no 
 * projects are found, it displays a "no information" placeholder message.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/page.tsx' to isolate the projects presentation.
 *
 * INPUTS / PARAMETERS:
 * - projects (ProjectsSummaryExtended[] | null, Required): The list of projects fetched from the database.
 */
export default function PastProjectsSection({ projects }: { projects: ProjectsSummaryExtended[] | null }) {
  const supabase = createClient()

  /**
   * BEHAVIORAL MECHANISM:
   * Generates the public access URL for uploaded attachments stored in Supabase bucket.
   *
   * PARAMETERS:
   * - imagePath (string): The storage path of the project poster image.
   *
   * RETURNS:
   * - string: The fully qualified public URL for the storage asset.
   */
  const handleGetUrl = (imagePath: string) => {
    const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath)
    return data.publicUrl
  }

  const displayedProjects = projects ? projects.slice(0, 4) : []
  // console.log(projects)
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 md:px-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <p className="text-[#00e0b3] font-semibold text-xs uppercase tracking-[0.3em] font-mono mb-2">
            Archive_01
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Past Projects</h2>
        </div>
        <div className="h-[1px] flex-grow bg-white/10 mb-2 mx-8 hidden md:block"></div>
        <Link
          href="/projects"
          className="text-[#b9cbc2] hover:text-[#00e0b3] font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shrink-0"
        >
          View All Archives{" "}
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </Link>
      </motion.div>

      {displayedProjects.length === 0 ? (
        <div className="text-center py-20 text-[#b9cbc2] font-mono text-sm uppercase">
          no information
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Project 1: Feature */}
          {displayedProjects[0] && (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="lg:col-span-8 group relative overflow-hidden rounded-sm border border-white/5 bg-[#1d1b1a] min-h-[450px] flex flex-col hover:border-[#00e0b3]/40 hover:shadow-[0_0_15px_rgba(0,224,179,0.1)] transition-all duration-300"
            >
              <div className="h-64 relative overflow-hidden shrink-0">
                {displayedProjects[0].groups?.events?.poster_path ? (
                  <Image
                    alt={displayedProjects[0].project_title || "Project"}
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                    src={handleGetUrl(displayedProjects[0].groups.events.poster_path)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2c2928] text-[#83958d] font-mono text-sm uppercase">
                    no image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b1a] to-transparent"></div>
              </div>
              <div className="p-8 md:p-10 pt-0 relative z-10 flex-grow flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#00e0b3] font-mono text-xs tracking-tighter">
                    {displayedProjects[0].groups?.events?.title 
                      ? `[ ${displayedProjects[0].groups.events.title} ]` 
                      : "[ Flagship_23 ]"}
                  </span>
                  <div className="h-px w-8 bg-[#00e0b3]/30"></div>
                  <span className="text-[#83958d] text-xs font-medium">
                    {displayedProjects[0].groups?.group_name || "Project Highlight"}
                  </span>
                </div>
                <Link href={displayedProjects[0].id ? `/projects/${displayedProjects[0].id}` : "/projects"} className="hover:text-[#00e0b3] transition-colors">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00e0b3] transition-colors">
                    {displayedProjects[0].project_title}
                  </h3>
                </Link>
                <p className="text-[#b9cbc2] text-sm md:text-base leading-relaxed mb-8 max-w-2xl opacity-70">
                  {displayedProjects[0].short_description}
                </p>
                <div className="mt-auto">
                  <Link
                    href={displayedProjects[0].id ? `/projects/${displayedProjects[0].id}` : "/projects"}
                    className="text-[#00e0b3] font-semibold text-sm uppercase tracking-widest inline-flex items-center gap-2 group/btn"
                  >
                    Detailed Report{" "}
                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                      north_east
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Project 2 */}
          {displayedProjects[1] && (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="lg:col-span-4 bg-[#1d1b1a] rounded-sm border border-white/5 p-8 md:p-10 flex flex-col hover:bg-[#211f1e] hover:border-[#00e0b3]/40 hover:shadow-[0_0_15px_rgba(0,224,179,0.1)] transition-all duration-300"
            >
              <div className="w-10 h-10 border border-[#00e0b3]/20 rounded-sm flex items-center justify-center mb-8 text-[#00e0b3] shrink-0">
                <span className="material-symbols-outlined scale-90">
                  lightbulb
                </span>
              </div>
              <Link href={displayedProjects[1].id ? `/projects/${displayedProjects[1].id}` : "/projects"} className="hover:text-[#00e0b3] transition-colors">
                <h3 className="text-xl font-bold mb-4">
                  {displayedProjects[1].project_title}
                </h3>
              </Link>
              <p className="text-[#b9cbc2] text-sm md:text-base opacity-60 leading-relaxed mb-10">
                {displayedProjects[1].short_description}
              </p>
              <Link 
                href={displayedProjects[1].id ? `/projects/${displayedProjects[1].id}` : "/projects"}
                className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center hover:opacity-80"
              >
                <span className="text-[10px] font-mono text-[#83958d] uppercase">
                  {displayedProjects[1].groups?.events?.title || "Hub_Entrepreneur"}
                </span>
                <span className="material-symbols-outlined text-[#00e0b3] text-sm">
                  arrow_forward
                </span>
              </Link>
            </motion.div>
          )}

          {/* Project 3 */}
          {displayedProjects[2] && (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="lg:col-span-4 bg-[#1d1b1a] rounded-sm border border-white/5 p-8 md:p-10 flex flex-col hover:bg-[#211f1e] hover:border-[#00e0b3]/40 hover:shadow-[0_0_15px_rgba(0,224,179,0.1)] transition-all duration-300"
            >
              <div className="w-10 h-10 border border-[#00e0b3]/20 rounded-sm flex items-center justify-center mb-8 text-[#00e0b3] shrink-0">
                <span className="material-symbols-outlined scale-90">code</span>
              </div>
              <Link href={displayedProjects[2].id ? `/projects/${displayedProjects[2].id}` : "/projects"} className="hover:text-[#00e0b3] transition-colors">
                <h3 className="text-xl font-bold mb-4">
                  {displayedProjects[2].project_title}
                </h3>
              </Link>
              <p className="text-[#b9cbc2] text-sm md:text-base opacity-60 leading-relaxed mb-10">
                {displayedProjects[2].short_description}
              </p>
              <Link 
                href={displayedProjects[2].id ? `/projects/${displayedProjects[2].id}` : "/projects"}
                className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center hover:opacity-80"
              >
                <span className="text-[10px] font-mono text-[#83958d] uppercase">
                  {displayedProjects[2].groups?.events?.title || "Collective_Dev"}
                </span>
                <span className="material-symbols-outlined text-[#00e0b3] text-sm">
                  arrow_forward
                </span>
              </Link>
            </motion.div>
          )}

          {/* Project 4: Horizontal */}
          {displayedProjects[3] && (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="lg:col-span-8 bg-[#1d1b1a] rounded-sm border border-white/5 p-8 flex flex-col md:flex-row gap-8 hover:bg-[#211f1e] hover:border-[#00e0b3]/40 hover:shadow-[0_0_15px_rgba(0,224,179,0.1)] transition-all duration-300 group"
            >
              <div className="w-full md:w-2/5 h-48 md:h-full min-h-[180px] shrink-0 overflow-hidden rounded-sm relative">
                {displayedProjects[3].groups?.events?.poster_path ? (
                  <Image
                    alt={displayedProjects[3].project_title || "Project"}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    src={handleGetUrl(displayedProjects[3].groups.events.poster_path)}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2c2928] text-[#83958d] font-mono text-sm uppercase">
                    no image
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center py-2">
                
                <Link href={displayedProjects[3].id ? `/projects/${displayedProjects[3].id}` : "/projects"} className="hover:text-[#00e0b3] transition-colors">
                  <h3 className="text-xl font-bold mb-3">
                    {displayedProjects[3].project_title}
                  </h3>
                </Link>
                <p className="text-[#b9cbc2] text-sm md:text-base opacity-60 mb-6 line-clamp-2">
                  {displayedProjects[3].short_description}
                </p>
                <Link
                  href={displayedProjects[3].id ? `/projects/${displayedProjects[3].id}` : "/projects"}
                  className="text-[#00e0b3] font-semibold text-xs uppercase tracking-widest inline-flex items-center gap-1 hover:underline"
                >
                  Spec Sheet{" "}
                  <span className="material-symbols-outlined text-xs">description</span>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  )
}
