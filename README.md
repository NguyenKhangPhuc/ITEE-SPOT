# ITEE SPOT

ITEE SPOT is a centralized portal developed for the IKAPO project in Oulu, Finland, designed to showcase student project solutions. The platform supports event creation, group formation, project submission, and grading evaluations, ensuring that student work is highlighted and graded systematically.

## Project Structure

The project is built using the Next.js App Router. The directory structure within the app folder is organized as follows:

* app/actions: Server Actions managing database queries, authentication updates, and grading.
* app/auth: Callback routes handling redirect verification and user sessions.
* app/components: Reusable layout and UI elements, including navigation and loading states.
* app/constants: Configuration settings such as pagination limits.
* app/context: Context providers managing global authentication state.
* app/events: Pages for displaying event lists, event details, creation forms, and event grading.
* app/groups: Group detail pages, group management, and user invitations.
* app/middleware: Access control sub-middleware components for route safety checks.
* app/profile: Pages allowing authenticated users to manage their profiles, upload posters, and edit bios.
* app/projects: Main dashboard for listing, filtering, and managing project submissions.
* app/student: Public-facing routes rendering student portfolios and accepted projects.
* app/submission: Forms and dashboards for challenge submissions, feedback, and grading.
* app/types: Shared TypeScript types and database interfaces.
* app/utils: Supabase client-side and server-side connection initializations.

## Logic and Flow

### 1. Unified Route Protection
Global route security is handled via a centralized proxy pattern. A root-level proxy.ts script catches requests and processes them sequentially through checks in the app/middleware directory. This controls access to admin panels, student profiles, grading screens, and redirects unauthorized traffic.

### 2. Database Security
Database queries are processed using server actions. Row-Level Security policies are implemented in Supabase to restrict access. Users can only modify their own profiles, group leaders manage their own teams, and students view only their active challenge submissions, while administrators retain full access for grading and management.

## Features and Capabilities

* User Authentication: Integration with Supabase Auth for user registrations, login, and password recoveries.
* Event Hosting: Facilities to create, edit, and organize events and hackathons.
* Team Coordination: Group creation, member invitation mechanics, and project sharing.
* Project Discovery Gallery: Dynamic project listings with advanced search, categorizations, and filters.
* Grading Rubrics: Evaluations based on configurable criteria, rating sliders, and final score calculations.
* Peer Interaction: Comment sections, reactions, and feedback tables on submissions.

## Tech Stack and Prerequisites

* Core Framework: Next.js (version 16.1.6)
* Library: React (version 19.2.3)
* Database and Auth: Supabase (via supabase-js and ssr)
* Styling: Tailwind CSS (version 4) and Sass
* Component Libraries: Emotion, Radix UI, Material UI Icons
* Form Handling: React Hook Form
* Rich Text Editing: Tiptap Editor

## Completed Work and Solved Problems

* Student Profile Portfolios: Implemented public routes (/student/[id]) displaying personal details and accepted projects.
* Cover Poster Uploads: Added file storage and server actions allowing students to upload and display cover images.
* Robust Error Handling for Empty Awards: Fixed frontend rendering crashes on events and projects lacking defined awards.
* Middleware Restructuring: Modularized route checking to prevent cross-profile modifications.
* Database Schema Upgrades: Added biography columns to profile tables and updated database triggers to sync authentication data.

## Installation and Setup Instructions

1. Install project dependencies:
   npm install

2. Configure environment variables by creating a .env.local file in the root directory:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

3. Run the application in development mode:
   npm run dev

4. Build the application for production:
   npm run build

## Usage Examples and API Endpoints

* Accessing the Landing Page: Home route (/) displays the spot-on solution showcase introduction.
* Event Overview: Browse to /events to check current challenges.
* Public Profile View: Browse to /student/[id] to check a student's public portfolio.
* Project Management: Browse to /projects/admins to manage and review project submissions.

## License

This project is proprietary.
