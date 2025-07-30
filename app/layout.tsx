import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/contexts/TaskContext";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { PetalsProvider } from "@/contexts/PetalsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Productivity App",
  description: "A productivity app with Pomodoro timer and task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundProvider>
          <PetalsProvider>
            <TaskProvider>
              <PomodoroProvider>
                {children}
              </PomodoroProvider>
            </TaskProvider>
          </PetalsProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
