'use client'

import { motion } from 'framer-motion'
import { tw } from '@/app/constants/design-tokens'
import Link from 'next/link'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

interface Section {
  index: number
  title: string
  content: React.ReactNode
}

const sections: Section[] = [
  {
    index: 1,
    title: 'Data Controller',
    content: (
      <p>
        The IKAPO Project Team at the University of Oulu acts as the Data Controller for the
        personal data processed within the ITEE SPOT platform.
      </p>
    ),
  },
  {
    index: 2,
    title: 'Information We Collect',
    content: (
      <>
        <p>
          To provide a functional collaborative environment, we collect and process the following
          categories of data based on our database schema:
        </p>
        <ul className="mt-4 space-y-2">
          {[
            {
              label: 'Identity & Account Information',
              text: 'Full name, email address, and avatar URL (via GitHub or email authentication).',
            },
            {
              label: 'Academic & Professional Profile',
              text: 'University, degree level, major, year of study, job title, company name, and company unit.',
            },
            {
              label: 'External Identifiers',
              text: 'Links to GitHub and LinkedIn profiles.',
            },
            {
              label: 'Project & Content Data',
              text: 'Project titles, descriptions, YouTube links, and any information provided in "fun facts" or project files.',
            },
            {
              label: 'Technical Identifiers',
              text: 'Invitation records (member emails) and system logs including IP addresses (stored for a maximum of 24 hours).',
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
    index: 3,
    title: 'Purpose of Processing & Public Visibility',
    content: (
      <>
        <p>
          Data is processed strictly to facilitate the matchmaking of students with projects and
          industry partners.{' '}
          <span className="text-[#e8e1df] font-semibold">
            Important regarding Profile Visibility:
          </span>
        </p>
        <p className="mt-3 text-[#b9cbc2]">
          By using the platform, your professional profile and project contributions are made
          visible to other registered participants and authorized judges to facilitate networking
          and project evaluation. We do not sell or share your data with third parties for
          marketing purposes.
        </p>
      </>
    ),
  },
  {
    index: 4,
    title: 'Legal Basis (GDPR)',
    content: (
      <>
        <p className="text-[#b9cbc2]">
          We process your data based on your{' '}
          <span className="text-[#e8e1df] font-semibold">explicit consent</span> provided during
          account creation. For system security and log maintenance, we process data based on{' '}
          <span className="text-[#e8e1df] font-semibold">legitimate interests</span>. You have the
          right to withdraw consent at any time by deleting your profile.
        </p>
        <p className="mt-3 text-[#b9cbc2]">
          Users are advised not to provide special sensitive personal information.
        </p>
      </>
    ),
  },
  {
    index: 5,
    title: 'Data Storage and Third-Party Processors',
    content: (
      <>
        <p className="text-[#b9cbc2]">
          Your data is securely stored and processed using infrastructure provided by{' '}
          <span className="text-[#e8e1df] font-semibold">
            CSC – IT Center for Science (Finland).
          </span>{' '}
          All data is hosted within the European Union (EU). We ensure that Data Processing
          Agreements (DPA) are in place with these providers to guarantee your data is handled in
          compliance with GDPR.
        </p>
        <ul className="mt-4 space-y-2">
          {[
            {
              label: 'Data Location',
              text: "All personal data is hosted on servers located within the European Union (EU), specifically utilizing CSC's Finnish infrastructure to self-hosting Supabase.",
            },
            {
              label: 'Special Data Handling',
              text: 'Consistent with CSC requirements, we do not process special categories of personal data (sensitive data) unless explicitly agreed upon.',
            },
            {
              label: 'Security Measures',
              text: 'We implement industry-standard security protocols, including TLS/SSL encryption for data in transit and restricted access at the infrastructure level.',
            },
            {
              label: 'Infrastructure',
              text: "We leverage Supabase's Row Level Security (RLS) to maintain strict isolation of user data.",
            },
            {
              label: 'Data Isolation',
              text: 'We utilize Row Level Security (RLS) within our self-hosted database to ensure that users can only access their own authorized data.',
            },
            {
              label: 'Maintenance',
              text: 'Regular security patches and updates are applied to the self-hosted environment to protect against vulnerabilities.',
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
    index: 6,
    title: 'Your Rights',
    content: (
      <>
        <p className="text-[#b9cbc2]">
          Under the General Data Protection Regulation (GDPR), you have the following rights:
        </p>
        <ul className="mt-4 space-y-2">
          {[
            {
              label: 'Access & Portability',
              text: 'The right to request a copy of your stored data in a structured format.',
            },
            {
              label: 'Rectification',
              text: 'The right to update or correct inaccurate data at any time.',
            },
            {
              label: 'Erasure',
              text: 'The right to request the deletion of your account ("Right to be Forgotten").',
            },
            {
              label: 'Restriction',
              text: 'The right to object to certain processing activities.',
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
]

export default function PrivacyPolicyPage() {
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
          {/* Breadcrumb / back link */}
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
            Privacy <span className="text-[#00e0b3]">Policy</span>
          </h1>

          <p className="text-xs text-[#83958d] leading-relaxed max-w-xl">
            This policy describes how the IKAPO Project Team at the University of Oulu collects,
            uses, and protects personal data processed within the ITEE SPOT platform in compliance
            with GDPR.
          </p>

          <div className="h-px bg-white/5 mt-2" />
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {sections.map((section) => (
            <motion.div
              key={section.index}
              variants={itemVariants}
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
              <div className="text-xs leading-relaxed text-[#b9cbc2] pl-1">
                {section.content}
              </div>
            </motion.div>
          ))}

          {/* Contact section */}
          <motion.div
            variants={itemVariants}
            className={`${tw.bg.surfaceContainerLow} border border-[#00e0b3]/20 rounded-sm p-6 flex flex-col gap-4 relative overflow-hidden`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00e0b3]" />

            <div className="flex items-center gap-3 pl-1">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#00e0b3] tabular-nums">
                07
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#e8e1df]">
                Contact Information
              </h2>
            </div>

            <div className="pl-1 flex flex-col gap-2">
              <p className="text-xs text-[#b9cbc2]">
                For any inquiries regarding data privacy or to exercise your rights under GDPR,
                please contact:
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
            href="/terms-and-conditions"
            className="text-[9px] text-[#83958d] hover:text-[#00e0b3] uppercase tracking-wider transition-colors"
          >
            Terms & Conditions
          </Link>
        </motion.div>
      </div>
    </div>
  )
}