'use client'

import { motion } from "framer-motion"
import Image from "next/image"

/**
 * PURPOSE:
 * This component renders the IKAPO Team section on the Home page, showing 4 team member cards
 * (Hanna, Kiyoko, Phuc, Marina) with custom hover scale effects and black-and-white to color transitions.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/page.tsx' to modularize the team section.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function TeamSection() {
  const teamMembers = [
    { name: "Hanna Saarela", role: "Development Manager", image: "/team/hanna.jpg" },
    { name: "Kiyoko Uematsu-Ervasti", role: "Project Specialist", image: "/team/kiyoko.png" },
    { name: "Phuc Nguyen", role: "Trainee", image: "/team/phuc.png" },
    { name: "Marina Saksa", role: "Trainee", image: "/team/marina.png" },
    // { name: "Vy Nguyen", role: "AI Specialist", image: "/team/vivi.png" },
  ]

  return (
    <section className="py-24 bg-[#100e0d] border-y border-white/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-[linear-gradient(to_right,rgba(0,224,179,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,224,179,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[#00e0b3] font-semibold text-xs uppercase tracking-[0.4em] font-mono mb-4">
            Core_Operators
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The IKAPO Team
          </h2>
          <div className="w-12 h-0.5 bg-[#00e0b3] mx-auto mb-8"></div>
          <p className="text-sm md:text-base text-[#b9cbc2] max-w-xl mx-auto opacity-70 leading-relaxed">
            A multidisciplinary unit dedicated to bridging the architectural gap between potential and production.
          </p>
        </motion.div>

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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="group text-center"
            >
              <div className="relative w-full aspect-square mb-6 overflow-hidden border border-white/5 p-1 bg-[#1d1b1a]">
                <Image
                  alt={member.name}
                  className="object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500"
                  src={member.image}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 border border-[#00e0b3]/0 group-hover:border-[#00e0b3]/30 transition-all duration-500"></div>
              </div>
              <h4 className="text-lg font-bold text-[#e8e1df] mb-1 group-hover:text-[#00e0b3] transition-colors">
                {member.name}
              </h4>
              <p className="text-[#83958d] font-mono text-[10px] uppercase tracking-widest">
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
