import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogSmith",
  description: "AI-powered blog generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col"> {/* Removed bg-background as body has gradient */}
          <SiteHeader />
          <main className="flex-1 flex flex-col items-center py-8"> {/* Centering content */}
            <div className="container w-full max-w-5xl px-4"> {/* Max width and padding for content */}
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
