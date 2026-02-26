'use client'

import { Button } from '@/components/ui/button'
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';
import { Play, Info, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

export default function Hero() {
    const { data: homeData, isLoading: homeLoading } = useQuery(
        orpc.anime.getHomePage.queryOptions({}),
    );
    const trendingAnimes = homeData?.trendingAnimes;


    return (
        <section className="relative w-full h-screen md:h-175 overflow-hidden group">
            {/* Background Image */}
            <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0.8) 100%), 
                                    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%237800ff;stop-opacity:0.2"/><stop offset="100%" style="stop-color:%23d96d5e;stop-opacity:0.1"/></linearGradient></defs><rect width="1200" height="700" fill="url(%23grad1)"/><circle cx="300" cy="200" r="150" fill="%237800ff" opacity="0.1"/><circle cx="900" cy="500" r="200" fill="%23d96d5e" opacity="0.08"/></svg>')`
                    }}
            />
            
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

            {/* Content */}
            {
                trendingAnimes?.map((anime) => {
                    console.log(anime);

                    return (
                        <div key={anime.id} className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl">
                            <div className="space-y-6">
                                {/* Anime Title & Badge */}
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-16 bg-accent rounded-full" />
                                    <span className="text-sm font-bold tracking-widest text-accent uppercase">New Episode</span>
                                </div>
                                
                                {/* Main Title */}
                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none text-balance text-white">
                                    Demon Slayer
                                </h1>

                                {/* Subtitle */}
                                <p className="text-2xl md:text-3xl text-gray-300 font-semibold">
                                    Swordmaster Arc
                                </p>

                                {/* Description */}
                                <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed pr-8">
                                    Tanjiro continues his quest to save humanity from demons. Experience breathtaking animation, intense action, and the evolution of the Demon Slayer Corps in this epic fourth season.
                                </p>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-8 pt-4 text-sm md:text-base">
                                    <div className="flex items-center gap-3">
                                    <span className="text-accent font-bold text-xl">9.1</span>
                                    <span className="text-gray-400">IMDb Rating</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                    <span className="text-accent font-bold text-xl">4</span>
                                    <span className="text-gray-400">Seasons</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                    <span className="text-accent font-bold text-xl">55+</span>
                                    <span className="text-gray-400">Episodes</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                    <span className="text-accent font-bold text-xl">2024</span>
                                    <span className="text-gray-400">Latest Season</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                    <Button 
                                    size="lg" 
                                    className="bg-white hover:bg-gray-200 text-black font-bold rounded-lg gap-3 h-14 px-8 text-lg transition-all"
                                    >
                                    <Play className="w-6 h-6 fill-current" />
                                    Play
                                    </Button>
                                    <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="bg-gray-500/30 hover:bg-gray-500/50 border-gray-500 text-white font-bold rounded-lg gap-3 h-14 px-8 text-lg transition-all"
                                    >
                                    <Info className="w-6 h-6" />
                                    More Info
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        {/* Mute Button */}
        {/* <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-8 right-8 z-30 p-3 rounded-full bg-gray-800/60 hover:bg-gray-700 text-white transition-colors"
            aria-label="Toggle sound"
        >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button> */}
        </section>
    )
}


        //    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl">
        //         <div className="space-y-6">

        //         {/* Anime Title & Badge */}
        //         <div className="flex items-center gap-4">
        //             <div className="h-2 w-16 bg-accent rounded-full" />
        //             <span className="text-sm font-bold tracking-widest text-accent uppercase">New Episode</span>
        //         </div>
                
        //         {/* Main Title */}
        //         <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none text-balance text-white">
        //             Demon Slayer
        //         </h1>

        //         {/* Subtitle */}
        //         <p className="text-2xl md:text-3xl text-gray-300 font-semibold">
        //             Swordmaster Arc
        //         </p>

        //         {/* Description */}
        //         <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed pr-8">
        //             Tanjiro continues his quest to save humanity from demons. Experience breathtaking animation, intense action, and the evolution of the Demon Slayer Corps in this epic fourth season.
        //         </p>

        //         {/* Stats */}
        //         <div className="flex flex-wrap gap-8 pt-4 text-sm md:text-base">
        //             <div className="flex items-center gap-3">
        //             <span className="text-accent font-bold text-xl">9.1</span>
        //             <span className="text-gray-400">IMDb Rating</span>
        //             </div>
        //             <div className="flex items-center gap-3">
        //             <span className="text-accent font-bold text-xl">4</span>
        //             <span className="text-gray-400">Seasons</span>
        //             </div>
        //             <div className="flex items-center gap-3">
        //             <span className="text-accent font-bold text-xl">55+</span>
        //             <span className="text-gray-400">Episodes</span>
        //             </div>
        //             <div className="flex items-center gap-3">
        //             <span className="text-accent font-bold text-xl">2024</span>
        //             <span className="text-gray-400">Latest Season</span>
        //             </div>
        //         </div>

        //         {/* Action Buttons */}
        //         <div className="flex flex-col sm:flex-row gap-4 pt-8">
        //             <Button 
        //             size="lg" 
        //             className="bg-white hover:bg-gray-200 text-black font-bold rounded-lg gap-3 h-14 px-8 text-lg transition-all"
        //             >
        //             <Play className="w-6 h-6 fill-current" />
        //             Play
        //             </Button>
        //             <Button 
        //             size="lg" 
        //             variant="outline" 
        //             className="bg-gray-500/30 hover:bg-gray-500/50 border-gray-500 text-white font-bold rounded-lg gap-3 h-14 px-8 text-lg transition-all"
        //             >
        //             <Info className="w-6 h-6" />
        //             More Info
        //             </Button>
        //         </div>
        //         </div>
        //     </div>