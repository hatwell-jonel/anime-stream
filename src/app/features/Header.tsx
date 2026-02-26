'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { Search, Menu, Bell, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'


function NavLink({ href, children }: React.PropsWithChildren<{ href: string }>) {
    return (
        <Link href={href} className="text-sm font-medium hover:text-primary transition">
            {children}
        </Link>
    )
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isMobile = useIsMobile()

    return (
        <header className="absolute md:sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
            <nav className="flex items-center justify-between px-4 md:px-8 py-4">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                        <span className="font-bold text-accent-foreground text-lg">A</span>
                    </div>
                    <span className="font-bold text-xl hidden md:inline">AnimeHub</span>
                </div>

                {/* Navigation - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="#">Home</NavLink>
                    <NavLink href="#">Trending</NavLink>
                    <NavLink href="#">Categories</NavLink>
                    <NavLink href="#">My List</NavLink>
                </div>

                {/* Search - Hidden on mobile */}
                <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
                <div className="relative w-full">
                    <Input 
                    placeholder="Search anime..." 
                    className="pl-10 bg-secondary text-foreground border-0"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                </div>

                {/* Right side actions */}
                {isMobile && (
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </nav>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden  px-4 py-4 border-t border-border bg-card">
                    <div className="space-y-3">
                        <NavLink href="#">Home</NavLink>
                        <NavLink href="#">Trending</NavLink>
                        <NavLink href="#">Categories</NavLink>
                        <NavLink href="#">My List</NavLink>
                    <div className="relative">
                    <Input 
                        placeholder="Search anime..." 
                        className="pl-10 bg-secondary text-foreground border-0 mt-2"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
                </div>
            )}
        </header>
    )
}
