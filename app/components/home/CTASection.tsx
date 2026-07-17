'use client'

import Link from "next/link"
import { motion } from "framer-motion"

/**
 * PURPOSE:
 * This component renders the Call to Action (CTA) banner section on the Home page, prompting 
 * users to deploy profiles or read documentation.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/page.tsx' to modularize the landing page layout.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function CTASection() {
  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#1d1b1a] p-10 md:p-20 text-center relative overflow-hidden rounded-sm border border-white/5"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(to_right,rgba(0,224,179,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,224,179,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-5 pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-[#00e0b3] font-semibold text-xs uppercase tracking-[0.5em] mb-6 font-mono">
            Execution_Ready
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Ready to shine?
          </h2>
          <p className="text-base md:text-lg text-[#b9cbc2] mb-12 max-w-2xl mx-auto opacity-70 leading-relaxed">
            Join the ecosystem where students lead the way. Deploy your vision or engage with the next generation of solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-[#00e0b3] text-[#00382b] font-bold text-sm px-12 py-4 rounded-sm hover:brightness-110 transition-all text-center uppercase tracking-widest"
            >
              Deploy Profile
            </Link>
            <Link
              href="/terms-and-conditions"
              className="w-full sm:w-auto bg-[#373433] text-[#e8e1df] font-bold text-sm px-12 py-4 rounded-sm border border-[#3a4a44]/30 hover:bg-white/10 transition-all text-center uppercase tracking-widest"
            >
              Documentation
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
