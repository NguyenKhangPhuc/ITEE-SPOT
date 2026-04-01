import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Roboto_Mono } from "next/font/google";

import "./globals.css";
import NotificationCard from "./components/Notification";
import { NotificationProvider } from "./context/NotificationContext";
import NavbarServer from "./components/NavbarServer";
import BottomBar from "./components/BottomBar";
import Loader from "./components/Loader";
import { LoaderProvider } from "./context/LoaderContext";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
export const metadata: Metadata = {

  title: "ITEE SPOT",
  description: "ITEE SPOT is a collaboration platform to manage the events and boost the connection between students and SMEs in Oulu, the platform is developed and maintained by IKAPO project which is co-funded by the European Union",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LoaderProvider>
        <NotificationProvider>
          <body
            className={`${robotoMono.variable} antialiased min-h-screen flex flex-col`}
          >
            <NavbarServer />
            <NotificationCard />
            <Loader />
            <main className="mt-18 flex-1"> {children}</main>
            <BottomBar />
          </body>
        </NotificationProvider>
      </LoaderProvider>

    </html>
  );
}
