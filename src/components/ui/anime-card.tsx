'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type AnimeItem = {
    id: string;
    name: string;
    poster: string;
    type?: string | null;
    jname?: string | null;
    episodes?: { sub: number | null; dub: number | null };
};


type TAnimeCardProps = {
    anime: AnimeItem;
    episodeCount: number | string;
}

function AnimeCard({anime, episodeCount}: TAnimeCardProps) {
    const href = `/anime/${anime.id}`;
    return (
        <Link
            href={href}
            className="group"
        >
            <div className="relative aspect-3/4 rounded-sm overflow-hidden bg-foreground/5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                {/* Poster */}
                <Image
                    src={anime.poster}
                    alt={anime.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Episode Badge */}
                <div className="absolute bottom-2 left-2 text-[14px] px-2 py-1 rounded-md bg-black/70 text-white backdrop-blur-sm">
                    {episodeCount} EP
                </div>

                {/* Type Badge */}
                {anime.type && (
                    <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-md bg-red-500/75 text-white font-bold">
                    {anime.type}
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="mt-3 text-sm font-medium line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors min-h-10">
                {anime.name}
            </h3>
        </Link>
    )
}

export default AnimeCard

