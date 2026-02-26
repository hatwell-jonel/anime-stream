'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';
import { Play, Info, Volume2, VolumeX } from 'lucide-react'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export default function Hero() {
    const { data: homeData, isLoading: homeLoading } = useQuery(
        orpc.anime.getHomePage.queryOptions({}),
    );

    const spotlightAnimes = homeData?.spotlightAnimes ?? []

    if (!spotlightAnimes.length) return null

    return (
        <section 
            className="relative w-full h-screen md:h-175 overflow-hidden group"
              style={
                {
                    '--swiper-pagination-color': '#ff3b5c',
                    '--swiper-pagination-bullet-inactive-color': '#ffffff50',
                } as React.CSSProperties
            }
        >

            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                loop={true}
                autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                effect="fade"
                className="h-full"
            >
                {spotlightAnimes.map((anime) => (
                    <SwiperSlide key={anime.id}>
                        <div className="relative w-full h-screen">

                        {/* Background Poster */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{backgroundImage: `url(${anime.poster})`,}}
                        />

                            {/* Dark overlays */}
                            <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent z-10" />
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />

                            {/* Content */}
                            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl">
                                <div className="space-y-6">

                                {/* Badge */}
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-16 bg-red-500 rounded-full" />
                                    <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
                                        Spotlight #{anime.rank}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-black text-white leading-tight">
                                    {anime.name}
                                </h1>

                                {/* Info */}
                                <div className="flex gap-6 text-gray-300 text-sm md:text-base">
                                    <span>{anime.type}</span>
                                    <span>{anime.otherInfo?.[1]}</span>
                                    <span>{anime.otherInfo?.[2]}</span>
                                    <span>{anime.otherInfo?.[3]}</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 max-w-xl line-clamp-3">
                                    {anime.description}
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap- pt-3">
                                    <Button
                                        size="lg"
                                        className="bg-white text-black hover:bg-gray-200 font-bold gap-2"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Play
                                    </Button>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white/20 gap-2"
                                    >
                                        <Info className="w-5 h-5" />
                                        More Info
                                    </Button>
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