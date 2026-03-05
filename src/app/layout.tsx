import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/tanstackquery/provider";
import Header from "~/features/Header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
  title: "Anime Hub",
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
              {children}
            </main>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
