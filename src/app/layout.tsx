import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/tanstackquery/provider";
import Header from "~/features/Header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sileo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anime Stream",
  description: "Watch your favorite anime on the web",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark max-w-497.5! mx-auto!`}
      >
        <NuqsAdapter >
          <QueryProvider>
            <Header />
            <main>
              <Toaster position="top-center" />
              {children}
            </main>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
