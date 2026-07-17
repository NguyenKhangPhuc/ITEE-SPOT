'use client'

import { motion } from 'framer-motion'
import { tw } from '@/app/constants/design-tokens'
import Link from 'next/link'

interface Section {
  index: number
  title: string
  content: React.ReactNode
}

const sections: Section[] = [
  {
    index: 1,
    title: 'Acceptance of Terms',
    content: (
      <p className="text-[#b9cbc2]">
        By accessing or using ITEE SPOT, you agree to be bound by these Terms &amp; Conditions.
        This platform is developed and managed by the IKAPO project team at the University of Oulu.
      </p>
    ),
  },
  {
    index: 2,
    title: 'Description of Service',
    content: (
      <p className="text-[#b9cbc2]">
        ITEE SPOT is a collaborative platform designed to manage events, hackathons, and project
        matchmaking. It facilitates connections between students, academic staff, and industry
        partners within the Faculty of Information Technology and Electrical Engineering (ITEE)
        through group formation and project showcases.
      </p>
    ),
  },
  {
    index: 3,
    title: 'User Registration and Access',
    content: (
      <>
        <p className="text-[#b9cbc2]">
          Users may register via Email or GitHub authentication. Access is primarily managed by
          invitation. By registering, you are responsible for maintaining the confidentiality of
          your account and all activities (such as project submissions or group interactions) that
          occur under your profile.
        </p>
        <p className="mt-3 text-[#b9cbc2]">
          Access is typically granted for a specific period (e.g., three months) related to the
          event lifecycle to encourage participants to collaborate and finalize shared materials.
          The administrator reserves the right to manage or revoke access based on event
          requirements.
        </p>
      </>
    ),
  },
  {
    index: 4,
    title: 'User Content and Public Visibility',
    content: (
      <>
        <p className="text-[#b9cbc2]">By using the platform, you agree that:</p>
        <ul className="mt-4 space-y-2">
          {[
            {
              label: 'Profile Display',
              text: 'Your professional details (name, university, job title, and social links) will be visible to other registered participants and judges.',
            },
            {
              label: 'Project Submissions',
              text: 'Content uploaded to the platform, including project descriptions, GitHub repositories, YouTube links, and files, will be shared for evaluation and collaborative purposes.',
            },
            {
              label: 'Conduct',
              text: 'You are solely responsible for the accuracy and legality of the content you post (including "fun facts" and project materials).',
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#00e0b3] shrink-0" />
              <span>
                <span className="text-[#00e0b3] font-semibold">{item.label}: </span>
                <span className="text-[#b9cbc2]">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    index: 5,
    title: 'Data Privacy',
    content: (
      <p className="text-[#b9cbc2]">
        We take your privacy seriously. Personal data collection is limited to what is necessary
        for event operations (matchmaking, group management, and judging). Please refer to our{' '}
        <Link
          href="/privacy-policy"
          className="text-[#00e0b3] hover:text-white underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </Link>{' '}
        for detailed information on how we handle your data and your rights under GDPR.
      </p>
    ),
  },
  {
    index: 6,
    title: 'Third-Party Links',
    content: (
      <p className="text-[#b9cbc2]">
        ITEE SPOT integrates with and provides links to external services such as GitHub,
        LinkedIn, and YouTube. We are not responsible for the content, privacy policies, or
        practices of these third-party services. Accessing these links is at your own risk.
      </p>
    ),
  },
  {
    index: 7,
    title: 'Modifications',
    content: (
      <p className="text-[#b9cbc2]">
        We reserve the right to update or modify these Terms &amp; Conditions at any time.
        Continued use of the platform following any changes constitutes your acceptance of the new
        Terms.
      </p>
    ),
  },
  {
    index: 8,
    title: 'Governing Law',
    content: (
      <p className="text-[#b9cbc2]">
        These Terms &amp; Conditions are governed by the laws of Finland. Any disputes arising
        from the use of this tool shall be subject to the jurisdiction of the courts of Finland.
      </p>
    ),
  },
]

export default function TermsAndConditionsPage() {
  return (
    <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-mono`}>
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 py-20 md:py-28 flex flex-col gap-12">

        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#83958d] hover:text-[#00e0b3] transition-colors w-fit"
          >
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            Back to Platform
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm font-bold text-[8px] uppercase tracking-widest">
              Legal Document
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-tight text-[#e8e1df]">
            Terms &amp; <span className="text-[#00e0b3]">Conditions</span>
          </h1>

          <p className="text-xs text-[#83958d] leading-relaxed max-w-xl">
            These Terms &amp; Conditions govern your use of the ITEE SPOT platform, operated by
            the IKAPO project team at the University of Oulu. By continuing to use this platform,
            you agree to be bound by these terms.
          </p>

          <div className="h-px bg-white/5 mt-2" />
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {sections.map((section) => (
            <motion.div
              key={section.index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className={`${tw.bg.surfaceContainerLow} border ${tw.border.whiteSubtle} rounded-sm p-6 flex flex-col gap-4 relative overflow-hidden`}
            >
              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00e0b3]/30" />

              {/* Section header */}
              <div className="flex items-center gap-3 pl-1">
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#00e0b3] tabular-nums">
                  {String(section.index).padStart(2, '0')}
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#e8e1df]">
                  {section.title}
                </h2>
              </div>

              {/* Section content */}
              <div className="text-xs leading-relaxed pl-1">
                {section.content}
              </div>
            </motion.div>
          ))}

          {/* Contact section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            className={`${tw.bg.surfaceContainerLow} border border-[#00e0b3]/20 rounded-sm p-6 flex flex-col gap-4 relative overflow-hidden`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00e0b3]" />

            <div className="flex items-center gap-3 pl-1">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#00e0b3] tabular-nums">
                09
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#e8e1df]">
                Contact
              </h2>
            </div>

            <div className="pl-1 flex flex-col gap-2">
              <p className="text-xs text-[#b9cbc2]">
                If you have any questions about these Terms &amp; Conditions, please contact the
                IKAPO Project at the University of Oulu:
              </p>
              <a
                href="mailto:hanna.saarela@oulu.fi"
                className="text-sm font-bold text-[#00e0b3] hover:text-white transition-colors"
              >
                hanna.saarela@oulu.fi
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center justify-between pt-4 border-t border-white/5"
        >
          <span className="text-[9px] text-[#83958d] uppercase tracking-wider">
            ITEE SPOT — IKAPO Project, University of Oulu
          </span>
          <Link
            href="/privacy-policy"
            className="text-[9px] text-[#83958d] hover:text-[#00e0b3] uppercase tracking-wider transition-colors"
          >
            Privacy Policy
          </Link>
        </motion.div>
      </div>
    </div>
  )
}