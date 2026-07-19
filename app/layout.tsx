import type { Metadata } from "next";
import { Montserrat, Inter, Roboto_Mono } from "next/font/google";

import "./globals.css";
import NotificationCard from "./components/Notification";
import { NotificationProvider } from "./context/NotificationContext";
import Loader from "./components/Loader";
import { LoaderProvider } from "./context/LoaderContext";
import FooterSection from "./components/FooterSection";
import NavbarServer from "./components/nav-bar/NavbarServer";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ITEE SPOT",
  description: "ITEE SPOT is a collaboration platform to manage the events and boost the connection between students and SMEs in Oulu, the platform is developed and maintained by IKAPO project which is co-funded by the European Union",
  icons: [
    {
      url: '/assets/search_logo.png',
      sizes: '48x48',
      type: 'image/png',
    },
  ],
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/search_logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <LoaderProvider>
        <NotificationProvider>
          <body
            className={`${robotoMono.variable} ${montserrat.variable} ${inter.variable} antialiased min-h-screen bg-[#151312] text-[#e8e1df] flex flex-col xl:flex-row`}
          >
            <NavbarServer />
            <div className="flex-grow flex flex-col min-w-0 pt-18 xl:pt-0 xl:pl-72 transition-all duration-300">
              <NotificationCard />
              <Loader />
              <main className="flex-1 flex flex-col"> {children}</main>
              <FooterSection />
            </div>
          </body>
        </NotificationProvider>
      </LoaderProvider>
    </html>
  );
}
