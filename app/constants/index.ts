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
            { title: 'About us', link: '/about-us' },
            { title: 'Projects', link: '/projects' },
            { title: 'Terms & Condition', link: '/terms-and-conditions' },
            { title: 'Privacy Policies', link: '/privacy-policy' }
        ]
    },
    {
        category: 'Competitions', items: [
            { title: 'Events', link: '/events' },
            { title: 'Groups', link: '/groups' },
            { title: 'Profiles', link: '/profile' },
        ]
    },
    {
        category: 'Judges', items: [
            { title: 'Create Events', link: '/events' },
            { title: 'Projects Management', link: '/groups' },
        ]
    },

    {
        category: 'Admin', items: [
            { title: 'Create Events', link: '/events' },
            { title: 'Projects Management', link: '/groups' },
        ]
    },
]

