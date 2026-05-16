import { PROFILE_ROLE } from "../types/enum"
import { ProjectsSummaryExtended } from "../types/projects"

export const PAGE_SIZE = 5

export const PAGE_SIZE_PROJECT = 4

export const SHORT_DESCRIPTION_LENGTH = 200

export const STUDENT_SUBMISSION_DESCRIPTION = 1500

export const EVENT_CREATED_DESCRIPTION = 7000

export const MAX_TOTAL_SIZE = 5 * 1024 * 1024;

export const EXAMPLE_PROJECT_SUMMANRY = `
<p style="text-align: left;">We are a <strong>team of ICT students specializing in embedded systems and applied AI</strong>. Our combined skills in engineering, analytics and usercentric design help us move quickly from concept to prototype. SmartLoad is designed for workshop operators, maintenance technicians and production managers who face <strong>unpredictable power peaks, equipment strain and unnecessary energy costs</strong>.&nbsp;</p><p style="text-align: left;">Our solution tackles a <strong>common bottleneck: sudden load spikes caused by simultaneous device use</strong>. Existing tools are costly and aimed at large factories, leaving smaller companies without practical options. SmartLoad introduces a <strong>lightweight edgeAI controller that learns usage patterns and balances power dynamically</strong>. Built with embedded C++, Pythonbased signal analysis and a custom MQTT layer, it includes a browser dashboard that predicts load peaks 5–15 minutes ahead for proactive decisions.&nbsp;</p><p style="text-align: left;">SmartLoad delivers <strong>immediate value by reducing wasted energy, lowering peak pricing and improving equipment lifetime</strong>. It also supports sustainability goals by cutting avoidable consumption and easing grid load. We turn course concepts—Embedded Systems, ML for IoT and DSP—into a functional prototype with full documentation. Early tests show 12–18% reductions in avoidable energy use, and the modular design enables easy piloting.&nbsp;</p><p style="text-align: left;">During the showcase, <strong>you can explore the dashboard, observe realtime predictions and discuss how SmartLoad could support your processes</strong>. We welcome your feedback and ideas for further development.&nbsp;</p>
`

export const NAVIGATION_BAR = [
    {
        category: 'About', items: [
            { title: 'Home', link: '/' },
            { title: 'Past Projects', link: '/projects' },
            { title: 'Terms & Condition', link: '/terms-and-conditions' },
            { title: 'Privacy Policies', link: '/privacy-policy' }
        ],
        role: null
    },
    {
        category: 'Competitions', items: [
            { title: 'Events', link: '/events' },

        ],
        role: PROFILE_ROLE.STUDENT
    },
    {
        category: 'Students', items: [
            { title: 'Groups', link: '/groups' },
            { title: 'Profiles', link: '/profile' },
            { title: 'Invitations', link: '/invitations' },
            { title: 'Showcase Projects', link: '/projects/students' },
        ],
        role: PROFILE_ROLE.STUDENT
    },

    {
        category: 'Admin', items: [
            { title: 'Create Events', link: '/events/create' },
            { title: 'Projects Management', link: '/projects/admins' },
        ],
        role: PROFILE_ROLE.ADMIN
    },
]
    ;

// export const mockProjects: Array<ProjectsSummaryExtended> = [
//     {
//         id: "proj-001",
//         group_id: "group-001",
//         project_title: "AI-Powered Traffic Management System",
//         project_status: "accepted",
//         top_priority: 1,
//         groups: {
//             group_name: "Tech Innovators",
//             short_description: "A smart system using computer vision and machine learning to optimize urban traffic flow and reduce congestion in real-time.",
//             event_id: "event-001",
//             events: {
//                 id: "event-001",
//                 title: "National Tech Hackathon 2024",
//                 status: "finished",
//                 location: "Ho Chi Minh City",
//                 start_date: "2024-11-01",
//                 end_date: "2024-11-03",
//                 poster_path: null,
//                 short_description: "Vietnam's largest student hackathon",
//                 organized_date: "2024-10-01",
//                 created_at: "2024-09-15T08:00:00Z",
//             },
//         },
//         project_awards: [
//             {
//                 id: "pa-001",
//                 award_id: "award-001",
//                 project_id: "proj-001",
//                 created_at: "2024-11-03T18:00:00Z",
//                 event_awards: {
//                     id: "award-001",
//                     award_title: "First Place",
//                     award_type: "general",
//                     award_priority: 1,
//                     event_id: "event-001",
//                 },
//             },
//         ],
//     },
//     {
//         id: "proj-002",
//         group_id: "group-002",
//         project_title: "GreenTrack - Carbon Footprint Monitor",
//         project_status: "accepted",
//         top_priority: 2,
//         groups: {
//             group_name: "EcoMinds",
//             short_description: "A mobile application that helps individuals and businesses track, analyze, and reduce their carbon footprint through daily activity monitoring.",
//             event_id: "event-001",
//             events: {
//                 id: "event-001",
//                 title: "National Tech Hackathon 2024",
//                 status: "finished",
//                 location: "Ho Chi Minh City",
//                 start_date: "2024-11-01",
//                 end_date: "2024-11-03",
//                 poster_path: null,
//                 short_description: "Vietnam's largest student hackathon",
//                 organized_date: "2024-10-01",
//                 created_at: "2024-09-15T08:00:00Z",
//             },
//         },
//         project_awards: [
//             {
//                 id: "pa-002",
//                 award_id: "award-002",
//                 project_id: "proj-002",
//                 created_at: "2024-11-03T18:00:00Z",
//                 event_awards: {
//                     id: "award-002",
//                     award_title: "Second Place",
//                     award_type: "general",
//                     award_priority: 2,
//                     event_id: "event-001",
//                 },
//             },
//         ],
//     },
//     {
//         id: "proj-003",
//         group_id: "group-003",
//         project_title: "MediConnect - Rural Healthcare Platform",
//         project_status: "accepted",
//         top_priority: 1,
//         groups: {
//             group_name: "HealthBridge",
//             short_description: "Connecting rural patients with urban specialists through an AI-assisted telemedicine platform that works with low-bandwidth internet connections.",
//             event_id: "event-002",
//             events: {
//                 id: "event-002",
//                 title: "Healthcare Innovation Summit 2025",
//                 status: "ongoing",
//                 location: "Hanoi",
//                 start_date: "2025-03-10",
//                 end_date: "2025-03-12",
//                 poster_path: null,
//                 short_description: "Innovating the future of healthcare in Vietnam",
//                 organized_date: "2025-02-01",
//                 created_at: "2025-01-10T08:00:00Z",
//             },
//         },
//         project_awards: [
//             {
//                 id: "pa-003",
//                 award_id: "award-003",
//                 project_id: "proj-003",
//                 created_at: "2025-03-12T17:00:00Z",
//                 event_awards: {
//                     id: "award-003",
//                     award_title: "Best Healthcare Solution",
//                     award_type: "specific",
//                     award_priority: 1,
//                     event_id: "event-002",
//                 },
//             },
//         ],
//     },
//     {
//         id: "proj-004",
//         group_id: "group-004",
//         project_title: "LearnLoop - Adaptive E-Learning Engine",
//         project_status: "accepted",
//         top_priority: null,
//         groups: {
//             group_name: "StudyForge",
//             short_description: "An adaptive learning platform that personalizes educational content based on each student's learning pace, style, and performance history.",
//             event_id: "event-002",
//             events: {
//                 id: "event-002",
//                 title: "Healthcare Innovation Summit 2025",
//                 status: "ongoing",
//                 location: "Hanoi",
//                 start_date: "2025-03-10",
//                 end_date: "2025-03-12",
//                 poster_path: null,
//                 short_description: "Innovating the future of healthcare in Vietnam",
//                 organized_date: "2025-02-01",
//                 created_at: "2025-01-10T08:00:00Z",
//             },
//         },
//         project_awards: [
//             {
//                 id: "pa-004",
//                 award_id: "award-004",
//                 project_id: "proj-004",
//                 created_at: "2025-03-12T17:00:00Z",
//                 event_awards: {
//                     id: "award-004",
//                     award_title: "Participant",
//                     award_type: "participant",
//                     award_priority: null,
//                     event_id: "event-002",
//                 },
//             },
//         ],
//     },
//     {
//         id: "proj-005",
//         group_id: "group-005",
//         project_title: "SafeRoute - Women Safety Navigation App",
//         project_status: "accepted",
//         top_priority: null,
//         groups: {
//             group_name: "Guardian Angels",
//             short_description: "A navigation app that uses crowdsourced safety data and real-time incident reports to suggest the safest routes for women traveling alone at night.",
//             event_id: "event-001",
//             events: {
//                 id: "event-001",
//                 title: "National Tech Hackathon 2024",
//                 status: "finished",
//                 location: "Ho Chi Minh City",
//                 start_date: "2024-11-01",
//                 end_date: "2024-11-03",
//                 poster_path: null,
//                 short_description: "Vietnam's largest student hackathon",
//                 organized_date: "2024-10-01",
//                 created_at: "2024-09-15T08:00:00Z",
//             },
//         },
//         project_awards: [
//             {
//                 id: "pa-005",
//                 award_id: "award-005",
//                 project_id: "proj-005",
//                 created_at: "2024-11-03T18:00:00Z",
//                 event_awards: {
//                     id: "award-005",
//                     award_title: "Participant",
//                     award_type: "participant",
//                     award_priority: null,
//                     event_id: "event-001",
//                 },
//             },
//         ],
//     },
// ];