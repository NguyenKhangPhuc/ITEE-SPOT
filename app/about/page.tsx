/**
 * PURPOSE:
 * SEO-optimized public-facing About page for ITEE SPOT.
 * Introduces the platform mission, capabilities, team, and funding partners.
 * Implements Next.js metadata export for title/meta injection and JSON-LD
 * structured data (WebPage + Organization schema) for search engine discoverability.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at the '/about' route via Next.js App Router.
 * No parent server wrapper — standalone Server Component.
 *
 * INPUTS / PARAMETERS:
 * None. Static Server Component — no props required.
 */

import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "About ITEE SPOT | Student-SME Collaboration Platform by IKAPO, Oulu",
  description:
    "ITEE SPOT is a co-funded EU collaboration platform built by IKAPO in Oulu, Finland. It connects SMEs with university students through events, hackathons, and project showcases. Explore our partnership programme.",
  keywords: [
    "ITEE SPOT",
    "collaboration platform",
    "event management",
    "boost the connection between SMEs and students",
    "University of Oulu",
    "co-funded by EU",
    "ITEE",
    "partnership programme",
    "IKAPO",
    "ICT student project showcase",
    "Oulu Finland student platform",
  ],
  openGraph: {
    title: "About ITEE SPOT | Student-SME Collaboration Platform by IKAPO",
    description:
      "Discover ITEE SPOT — the EU co-funded platform connecting SMEs and ICT students in Oulu through hackathons, project showcases, and structured evaluations.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/about",
  },
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "About ITEE SPOT",
      description:
        "ITEE SPOT is an EU co-funded collaboration platform developed by the IKAPO team in Oulu, Finland, connecting SMEs with ICT students through events, hackathons, and project evaluation systems.",
      url: "https://iteeskillforge.vercel.app/about",
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: "ITEE SPOT",
        url: "https://iteeskillforge.vercel.app",
      },
    },
    {
      "@type": "Organization",
      name: "IKAPO",
      url: "https://www.ikapo.fi/",
      description:
        "IKAPO is an ICT partnership project based in Oulu, Finland, co-funded by the European Union, fostering international growth for North Ostrobothnia through student-SME collaboration.",
      foundingLocation: {
        "@type": "Place",
        name: "Oulu, Finland",
      },
      funder: {
        "@type": "Organization",
        name: "European Union",
      },
    },
  ],
}

// ─── Feature Cards Data ───────────────────────────────────────────────────────
const capabilities = [
  {
    icon: "event",
    label: "Event Management",
    description:
      "Create, manage, and publish hackathons, ICT competitions, and innovation challenges. Administrators control the full lifecycle — from setup to award distribution.",
  },
  {
    icon: "groups",
    label: "Student Groups & Projects",
    description:
      "Students form teams, register for active events, upload project submissions with rich-text summaries and poster attachments, and track evaluation progress in real time.",
  },
  {
    icon: "grading",
    label: "Expert Evaluation",
    description:
      "Judges and industry professionals evaluate submissions through structured rubric-based scoring — criteria weighting, evaluation sliders, and final score calculation.",
  },
  {
    icon: "manage_accounts",
    label: "Administrative Governance",
    description:
      "Full admin portals for user role management, group oversight, event registration control, and comprehensive search, filter, and sorting across all data entities.",
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col gap-6">

          {/* ── SECTION 1: Hero ─────────────────────────────────────────────── */}
          <section aria-labelledby="hero-heading">
            {/* Platform badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-[9px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest uppercase font-bold">
                EU Co-Funded
              </span>
              <span className="text-[9px] font-mono text-[#83958d] border border-white/5 bg-white/[0.02] px-3 py-1 rounded-sm tracking-widest uppercase">
                IKAPO Project
              </span>
              <span className="text-[9px] font-mono text-[#83958d] border border-white/5 bg-white/[0.02] px-3 py-1 rounded-sm tracking-widest uppercase">
                Oulu, Finland
              </span>
            </div>

            {/* H1 — Primary keyword: ITEE SPOT Student-SME Collaboration Platform */}
            <div className="flex gap-4 items-stretch mb-6">
              <div className="w-[3px] bg-[#00e0b3] shrink-0" />
              <div className="flex flex-col gap-2">
                <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
                  ABOUT // ITEE_SPOT
                </span>
                <h1
                  id="hero-heading"
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight"
                >
                  ITEE SPOT —{" "}
                  <span className="text-[#00e0b3]">Student-SME</span>{" "}
                  Collaboration Platform
                </h1>
              </div>
            </div>

            <p className="text-sm md:text-base text-[#b9cbc2] leading-relaxed max-w-3xl mb-10 font-mono">
              ITEE SPOT is a centralized digital platform built to{" "}
              <strong className="text-[#e8e1df]">
                boost the connection between SMEs and ICT students
              </strong>{" "}
              in Oulu, Finland. Developed by the IKAPO team and co-funded by the
              European Union, it provides structured event management, student
              project showcases, and professional evaluation systems — bridging
              the gap between industry and academia.
            </p>

            {/* CTA Links */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-[#00e0b3] text-[#00382b] font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-sm hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-sm">event</span>
                Browse Events
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border border-[#00e0b3]/30 text-[#00e0b3] font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-sm hover:bg-[#00e0b3]/5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">account_tree</span>
                View Projects
              </Link>
            </div>
          </section>

          {/* ── SECTION 2: Mission ──────────────────────────────────────────── */}
          <section aria-labelledby="mission-heading">
            <div className="border-b border-white/5 pb-8 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[3px] h-4 bg-[#00e0b3]" />
                <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                  02_MISSION
                </span>
              </div>
              <h2
                id="mission-heading"
                className="text-xl md:text-2xl font-extrabold text-[#e8e1df] uppercase tracking-tight mb-4"
              >
                Bridging the Gap Between SMEs and Students
              </h2>
              <p className="text-sm text-[#b9cbc2] leading-relaxed max-w-3xl">
                Small and medium enterprises in North Ostrobothnia often struggle to
                access fresh engineering talent, while ICT students at the University
                of Oulu need real-world problems to validate their skills. ITEE SPOT
                resolves this mismatch through a structured{" "}
                <strong className="text-[#e8e1df]">partnership programme</strong> —
                giving companies a direct channel to sponsor challenges, and giving
                students a competitive platform to showcase solutions evaluated by
                industry experts.
              </p>
            </div>

            {/* Mission stat pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "Events", label: "Hackathons & Competitions" },
                { value: "Groups", label: "Student Teams" },
                { value: "Projects", label: "Evaluated Submissions" },
                { value: "Judges", label: "Industry Professionals" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1d1b1a] border border-white/5 rounded-sm p-4 flex flex-col gap-1"
                >
                  <span className="text-[#00e0b3] font-mono text-xs font-bold uppercase tracking-widest">
                    {stat.value}
                  </span>
                  <span className="text-[#83958d] font-mono text-[9px] uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 3: Platform Capabilities ───────────────────────────── */}
          <section aria-labelledby="capabilities-heading">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-[3px] h-4 bg-[#00e0b3]" />
              <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                03_PLATFORM_CAPABILITIES
              </span>
            </div>
            <h2
              id="capabilities-heading"
              className="text-xl md:text-2xl font-extrabold text-[#e8e1df] uppercase tracking-tight mb-8"
            >
              What ITEE SPOT Provides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {capabilities.map((cap) => (
                <article
                  key={cap.label}
                  className="bg-[#1d1b1a] border border-white/5 rounded-sm p-5 flex flex-col gap-4 hover:border-[#00e0b3]/20 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-sm bg-[#00e0b3]/5 border border-[#00e0b3]/10 flex items-center justify-center group-hover:bg-[#00e0b3]/10 transition-colors">
                    <span className="material-symbols-outlined text-[#00e0b3] text-lg">
                      {cap.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-mono font-bold text-xs text-[#e8e1df] uppercase tracking-wider">
                      {cap.label}
                    </h3>
                    <p className="font-mono text-[11px] text-[#83958d] leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── SECTION 4: Who We Are ───────────────────────────────────────── */}
          <section aria-labelledby="team-heading">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-[3px] h-4 bg-[#00e0b3]" />
              <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                04_WHO_WE_ARE
              </span>
            </div>
            <h2
              id="team-heading"
              className="text-xl md:text-2xl font-extrabold text-[#e8e1df] uppercase tracking-tight mb-8"
            >
              The People Behind ITEE SPOT
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IKAPO Team card */}
              <article className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#00e0b3]/10 border border-[#00e0b3]/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#00e0b3] text-base">
                      corporate_fare
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-[#83958d] uppercase tracking-widest">
                      Project Owner
                    </p>
                    <p className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
                      IKAPO Team
                    </p>
                  </div>
                </div>
                <p className="font-mono text-[11px] text-[#83958d] leading-relaxed">
                  IKAPO (ICT Experts Creating Sustainable International Growth for
                  North Ostrobothnia) is an international cooperation project based
                  in Oulu, Finland. The team coordinates the partnership programme
                  connecting local SMEs with engineering students.
                </p>
                <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                  <p className="font-mono text-[9px] text-[#83958d] uppercase tracking-widest">
                    Development Manager
                  </p>
                  <a
                    href="https://www.oulu.fi/en/researchers/hanna-saarela"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#00e0b3] hover:underline underline-offset-4 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                    Hanna Saarela — University of Oulu
                  </a>
                </div>
              </article>

              {/* Main developer card */}
              <article className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#00e0b3]/10 border border-[#00e0b3]/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#00e0b3] text-base">
                      terminal
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-[#83958d] uppercase tracking-widest">
                      Main Developer
                    </p>
                    <p className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
                      Phuc Nguyen
                    </p>
                  </div>
                </div>
                <p className="font-mono text-[11px] text-[#83958d] leading-relaxed">
                  Phuc Nguyen is a Computer Sciences and Engineering student at the
                  University of Oulu who architected and built the ITEE SPOT platform
                  end-to-end. The platform is built on Next.js, TypeScript, Supabase,
                  and Tailwind CSS — featuring a fully responsive dark terminal design
                  system with role-based access control and structured data management.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] text-[#83958d] border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded-sm uppercase tracking-wider"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </article>
            </div>
          </section>

          {/* ── SECTION 5: Partners & Funding ───────────────────────────────── */}
          <section aria-labelledby="partners-heading">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-[3px] h-4 bg-[#00e0b3]" />
              <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                05_PARTNERS_AND_FUNDING
              </span>
            </div>
            <h2
              id="partners-heading"
              className="text-xl md:text-2xl font-extrabold text-[#e8e1df] uppercase tracking-tight mb-8"
            >
              Funding & Partners
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* EU Funding */}
              <article className="bg-[#1d1b1a] border border-[#00e0b3]/10 rounded-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 shrink-0">
                    <Image
                      src="/assets/EU_LOGO.png"
                      alt="Co-funded by the European Union logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <p className="font-mono text-xs font-bold text-[#00e0b3] uppercase tracking-wider">
                    European Union
                  </p>
                </div>
                <p className="font-mono text-[11px] text-[#83958d] leading-relaxed">
                  ITEE SPOT is co-funded by the European Union as part of the IKAPO
                  international growth initiative, supporting cross-border collaboration
                  between academia and industry in North Ostrobothnia.
                </p>
                <span className="font-mono text-[9px] text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-2 py-0.5 rounded-sm uppercase tracking-widest self-start">
                  Co-Funded Partner
                </span>
              </article>

              {/* IKAPO */}
              <article className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 shrink-0">
                    <Image
                      src="/assets/IKAPO_logo.png"
                      alt="IKAPO logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <p className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
                    IKAPO
                  </p>
                </div>
                <p className="font-mono text-[11px] text-[#83958d] leading-relaxed">
                  The IKAPO project coordinates the student-SME partnership programme
                  in Oulu, organizing events and managing the platform ecosystem
                  that ITEE SPOT powers.
                </p>
                <a
                  href="https://www.ikapo.fi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#00e0b3] hover:underline underline-offset-4 transition-all self-start"
                >
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                  ikapo.fi
                </a>
              </article>

              {/* University of Oulu / IKAPO Project */}
              <article className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-sm bg-[#00e0b3]/10 border border-[#00e0b3]/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#00e0b3] text-base">
                      school
                    </span>
                  </div>
                  <p className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
                    University of Oulu
                  </p>
                </div>
                <p className="font-mono text-[11px] text-[#83958d] leading-relaxed">
                  The University of Oulu hosts the IKAPO project and provides the
                  academic foundation for the student-SME collaboration programme,
                  connecting engineering students with real-world industry challenges.
                </p>
                <a
                  href="https://www.oulu.fi/en/projects/ict-experts-creating-sustainable-international-growth-for-north-ostrobothnia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#00e0b3] hover:underline underline-offset-4 transition-all self-start"
                >
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                  View IKAPO Project
                </a>
              </article>
            </div>
          </section>

          {/* ── SECTION 6: Internal CTA ─────────────────────────────────────── */}
          <section
            aria-labelledby="explore-heading"
            className="bg-[#1d1b1a] border border-white/5 rounded-sm p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-4 bg-[#00e0b3]" />
                <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                  06_EXPLORE
                </span>
              </div>
              <h2
                id="explore-heading"
                className="text-lg md:text-xl font-extrabold text-[#e8e1df] uppercase tracking-tight"
              >
                Explore the Platform
              </h2>
              <p className="font-mono text-[11px] text-[#83958d] max-w-md leading-relaxed">
                Browse active events, discover student project submissions from
                past hackathons, or register your team for the current competition.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-[#00e0b3] text-[#00382b] font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-sm hover:brightness-110 transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">event</span>
                Active Events
              </Link>
              <Link
                href="/projects/students"
                className="inline-flex items-center gap-2 border border-[#00e0b3]/30 text-[#00e0b3] font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-sm hover:bg-[#00e0b3]/5 transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">account_tree</span>
                Student Showcase
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
