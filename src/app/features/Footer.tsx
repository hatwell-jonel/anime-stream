'use client';
import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* Logo / Brand */}
                <Logo />

                {/* Navigation */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                    </Link>
                    <Link href="/browse" className="hover:text-foreground transition-colors">
                    Browse
                    </Link>
                    <Link href="/library" className="hover:text-foreground transition-colors">
                    Library
                    </Link>
                    <Link href="/saved" className="hover:text-foreground transition-colors">
                    Saved
                    </Link>
                </div>

                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} AnimeStream.</p>

                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms
                    </Link>
                </div>
                </div>

            </div>
        </footer>
    );
}