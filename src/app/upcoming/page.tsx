'use client'
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

function Upcoming() {
    const { data: upcomingData, isLoading: upcomingLoading } = useQuery(
        orpc.anime.getEstimatedSchedule.queryOptions({
            input: {
                date: "2026-02-01",
            },
        }),
    );

    console.log(upcomingData);
    return (
        <main className='max-w-7xl mx-auto px-4 md:px-6 py-8'>
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Upcoming Anime</h1>
                <p className="text-gray-400 text-lg">Discover exciting anime coming soon to AnimeHub</p>
            </div>
        </main>
    )
}

export default Upcoming