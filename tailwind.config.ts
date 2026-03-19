import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'iphone': '40rem', // 640px
            'md': '48rem',     // 768px (Giữ nguyên hoặc đổi tên nếu muốn)
            'lg': '64rem',     // 1024px
            'ipad': '80rem',   // 1280px (Thay cho xl)
            '2xl': '96rem',    // 1536px
        },
        extend: {
            fontFamily: {
                mono: ["var(--font-mono)"],
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '100%',
                    },
                },
            },
        },

    },
    plugins: [
        typography,
    ],
};

export default config;