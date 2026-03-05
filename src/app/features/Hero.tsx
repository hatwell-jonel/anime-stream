'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';
import { Play, Info } from 'lucide-react'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import Link from 'next/link';

export default function Hero() {
    const { data: homeData, isLoading: homeLoading } = useQuery(
        orpc.anime.getHomePage.queryOptions({}),
    );

    const spotlightAnimes = homeData?.spotlightAnimes ?? []

    if (!spotlightAnimes.length) return null

    if (homeLoading) {
        return (
            <div className="relative w-full h-screen md:h-175 overflow-hidden flex items-center justify-center">
                <span className="text-white text-xl">Loading spotlight...</span>
            </div>
        )
    }

    return (
        <section 
            className="relative w-full h-screen md:h-175 overflow-hidden group"
            style={{
                '--swiper-pagination-color': '#ff3b5c',
                '--swiper-pagination-bullet-inactive-color': '#ffffff50',
            } as React.CSSProperties}
        >

            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                effect="fade"
                className="h-full"
            >
                {spotlightAnimes.map((anime) => (
                    <SwiperSlide key={anime.id}>
                        <div className="relative w-full h-screen">

                            {/* Background Poster */}
                            <div
                                className="absolute inset-0 bg-cover bg-center filter scale-105"
                                style={{ backgroundImage: `url(${anime.poster})` }}
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

                            {/* Content */}
                            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl animate-fadeIn">
                                <div className="space-y-5 md:space-y-6">

                                    {/* Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-16 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-xs md:text-sm font-bold tracking-widest text-red-500 uppercase">
                                            Spotlight #{anime.rank}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
                                        {anime.name}
                                    </h1>

                                    {/* Info */}
                                    <div className="flex flex-wrap gap-4 text-gray-300 text-sm md:text-base">
                                        <span>{anime.type}</span>
                                        {anime.otherInfo?.slice(1, 4).map((info, idx) => (
                                            <span key={idx}>{info}</span>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-200 max-w-xl line-clamp-3 md:line-clamp-4 drop-shadow-sm">
                                        {anime.description}
                                    </p>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                        <Link 
                                            href={`/watch/${anime.id}/1`}
                                        >
                                            <Button
                                                size="lg"
                                                className="cursor-pointer bg-red-500 text-white hover:bg-red-600 font-bold gap-2 shadow-lg transition-transform transform hover:-translate-y-0.5"
                                            >
                                                <Play className="w-5 h-5" />
                                                Play
                                            </Button>
                                        </Link>

                                        <Link href={`/anime/${anime.id}`}>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="cursor-pointer border-white text-white hover:bg-white/20 font-bold gap-2 transition-all"
                                            >
                                                <Info className="w-5 h-5" />
                                                More Info
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}