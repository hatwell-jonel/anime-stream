'use client';
import Link from 'next/link';
import React from 'react'

function AnimeList() {

    return (
        <Link 
            href={`/anime/`}
        >
            AnimeList
        </Link>
    )
}

export default AnimeList