'use client'

import Link from "next/link"
import Image from "next/image"

/**
 * PURPOSE:
 * This component renders the detailed Footer section of the Home page. It includes brand 
 * description, navigation lists, copyright note, and system status indicator.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/page.tsx' to modularize the page footer.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function FooterSection() {
  return (
    <footer className="bg-[#100e0d] border-t border-white/5 w-full py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/assets/iteespot_logo.png"
                alt="ITEE SPOT"
                width={112}
                height={32}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-[#b9cbc2] opacity-60 max-w-sm mb-8 leading-relaxed">
              Student-led technological excellence. Providing spot-on solutions for tomorrow&apos;s complex challenges.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#e8e1df] mb-6">
              Navigation
            </h4>
            <ul className="space-y-4 text-[#b9cbc2] text-sm">
              <li>
                <Link href="/about" className="hover:text-[#00e0b3] transition-colors">
                  Platform Overview
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#00e0b3] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#00e0b3] transition-colors">
                  Contributions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#e8e1df] mb-6">
              Protocol
            </h4>
            <ul className="space-y-4 text-[#b9cbc2] text-sm">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-[#00e0b3] transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#00e0b3] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] text-[#83958d] uppercase tracking-widest">
            © 2026 ITEE SPOT // System_Compiled_By_IKAPO_Team
          </p>
          <div className="flex gap-2 items-center text-[10px] font-mono text-[#00e0b3] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00e0b3] animate-pulse"></span>
            System Status: Nominal
          </div>
        </div>
      </div>
    </footer>
  )
}
