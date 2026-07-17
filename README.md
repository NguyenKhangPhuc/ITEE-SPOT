# ITEE SPOT

ITEE SPOT is a centralized portal developed for the IKAPO project in Oulu, Finland, designed to showcase student project solutions, event challenges, and academic hackathons. The platform supports event creation, group formation, project submission, challenge evaluations, and administrative user/group governance.

## Features & Capabilities

- User Authentication Suite: Complete auth flows for user registration, login, account verification via OTP, password recovery, password resets, and Github OAuth integration.
- Admin User Management Portal: Comprehensive user management table supporting email search, role filters (Student, Admin, Judges), university filters, programme filters, full-name sorting, and real-time inline role editing.
- Admin Group Management Portal: Administrative dashboard for tracking student teams, searching group titles/descriptions, filtering by events, sorting by registration dates, expanding accordion rows to inspect team members, removing group members, and deleting assigned challenges.
- Dynamic Confirmation Modal System: Reusable full-screen blocking modal enforcing explicit confirmation before executing destructive operations (member removal, challenge deletion, self-exclusion).
- Student Showcase & Submissions: Dynamic portfolio showcase, project submission management, rich text summaries, cover poster attachments, and showcase project section tabs.
- Event Hosting & Challenges: Multi-stage event management, challenge definitions, award distributions, and company challenge assignments.
- Evaluation & Grading Rubrics: Comprehensive rubric-based scoring systems, criteria weightings, evaluation sliders, and final score calculations for judges and administrators.
- Navigation System: Multi-role responsive navigation sidebar and mobile slide-in drawer with dynamic category authorization based on user roles.

## Tech Stack & Prerequisites

| Category | Technology |
| --- | --- |
| Core Framework | Next.js 16.1.6 (App Router) |
| Core Library | React 19.2.3 |
| Language | TypeScript 5 |
| Database & Auth | Supabase (supabase-js 2.98.0 & @supabase/ssr 0.8.0) |
| Styling | Tailwind CSS 4, Sass, Centralized Design Tokens (app/constants/design-tokens.ts) |
| Animation | Framer Motion 12.42.2 |
| UI Components & Icons | Material UI Icons (@mui/icons-material 7.3.8), Emotion, Radix UI |
| Form Handling | React Hook Form 7.71.2 |
| Rich Text Editor | Tiptap Editor Suite 3.20.0 |

## Project Structure

The project is structured around the Next.js App Router directory layout:

- app/actions: Server Actions managing database operations, Supabase Auth updates, profiles, events, groups, challenges, invitations, and votes.
- app/auth: Callback handlers for Supabase OAuth redirect verifications and user session exchanges.
- app/components: Reusable UI components including BackButton, DynamicModal, Navbar, NavbarMobile, MobileMenuDrawer, file-management, and project-management modules.
- app/constants: Centralized design tokens (design-tokens.ts) defining HSL color palettes, dark terminal layout tokens, and navigation bar definitions (index.ts).
- app/context: React Context providers for global loading states (LoaderContext.tsx) and toast notifications (NotificationContext.tsx).
- app/events: Pages for event creation, event listings, event detail views, challenge assignments, and evaluation rubrics.
- app/forget-password: Password recovery request portal styled with dark terminal design tokens.
- app/group-management: Admin Group Management dashboard featuring search, event filtering, created_at sorting, pagination, and expandable member/challenge management.
- app/groups: Group detail views, team member management, invitation flows, and student self-exclusion protocols.
- app/helpers: Shared client-side pagination helper components (Pagination.tsx).
- app/invitations: Student invitation management portal.
- app/login: Redesigned dark terminal Sign In portal with email/password authentication and Github OAuth.
- app/maintenance: Maintenance status screen.
- app/middleware: Modular route security checkers verifying user role authorization.
- app/profile: User profile configuration pages for avatar uploads and bio edits.
- app/projects: Sub-directories for student project management (app/projects/students) and admin project showcase controls (app/projects/admins).
- app/register: User onboarding registration pages.
- app/reset-password: Password reset confirmation portal with OTP verification.
- app/sign-up: Redesigned Create Account portal and OTP verification page (app/sign-up/verify-account).
- app/student: Public-facing student portfolio showcase pages (/student/[id]).
- app/submission: Challenge submission portal, grading rubrics, and submission file attachments.
- app/types: Shared TypeScript types, database schemas (database.types.ts), enums (enum.ts), and form interfaces (form_data.ts).
- app/user-management: Admin User Management dashboard with search, multi-select filters, sorting, inline role updates, and decomposed subcomponents.
- app/utils: Supabase client-side (client.ts) and server-side (server.ts) client initializations.

## Logic & Architecture

1. Route Protection & Proxy Control: Global route security is enforced using a centralized proxy pattern. A root-level proxy.ts handler routes incoming requests through middleware modules in app/middleware, enforcing role-based access control for administrative portals, student dashboards, and evaluation pages.
2. Server Actions & Row-Level Security: All database modifications execute via Next.js Server Actions using Supabase server clients. Database tables enforce Row-Level Security (RLS) policies ensuring students can only edit their own groups/submissions while administrators hold overarching governance permissions.
3. Centralized Design Token System: Visual presentation across components and portals relies on app/constants/design-tokens.ts. This ensures consistent dark terminal aesthetics, padding standards, typography scales, HSL background tones, and border utilities across desktop and mobile views.
4. Component Decomposition: Complex management portals (User Management, Group Management) follow a strict modular architecture. Monolithic views are decomposed into focused child components (filters, tables, modals) with strict TypeScript prop definitions and isolated state handling.

## Completed Work & Solved Problems

- User Management Portal Development: Implemented full administrative user management (/user-management) supporting email/name search, role filtering (PROFILE_ROLE enum), university filtering (UNIVERSITY enum), programme filtering (PROGRAMME enum), full-name sorting, and real-time inline role updating via updateUserRoleByUserId.
- Group Management Dashboard Implementation: Created admin group management (/group-management) featuring group search, event title filtering, creation date sorting, client-side pagination (20 items/page), and expandable accordion rows.
- Relational State Synchronization Bug Fix: Resolved a state update key mismatch between singular and plural relational properties (group_challenges vs group_challenge, group_members vs group_member). Ensured member removals and challenge deletions immediately reflect in the client UI without requiring browser reloads.
- Destructive Action Confirmation System: Built a reusable DynamicModal component adhering to dark terminal design tokens. Integrated modal popups to require explicit confirmation before member removal, challenge deletion, and student self-exclusion protocol execution.
- Authentication Portal Redesign: Redesigned all 5 authentication pages (/login, /sign-up, /sign-up/verify-account, /forget-password, /reset-password) with a unified dark terminal form card layout, cyan accent buttons, and dark input fields while preserving 100% of existing validation and server action logic.
- Admin and Student Projects Dashboard Overhaul: Modularized project components into app/components/project-management/ (EditProjectFormSection.tsx) and app/components/file-management/ (SubmissionFileSection.tsx). Refactored admin and student project sections with dynamic client-side lazy loading, tab slide animations, and dark theme design tokens.
- Navigation Architecture Enhancement: Expanded NAVIGATION_BAR in app/constants/index.ts to include User Management (/user-management) and Group Management (/group-management) options, complete with Material UI icon mappings in Navbar.tsx and MobileMenuDrawer.tsx.

## Installation & Setup Instructions

1. Install project dependencies:
   npm install

2. Configure environment variables by creating a .env.local file in the root directory:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

3. Run the application in development mode:
   npm run dev

4. Build the application for production:
   npm run build

## License

This project is licensed under the MIT License.
