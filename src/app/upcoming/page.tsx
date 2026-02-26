'use client'
import React, { useMemo, useState } from 'react'
import { orpc } from '@/lib/tanstackquery/orpc';
import { formatDate, formatTime } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

type DateObj = {
    date: Date;
    label: string;
    shortLabel: string;
    dateStr: string;
    dayNum: string;
}

function getCurrentSevenDays() : DateObj[] {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        let label: string;
        let shortLabel: string;
        if (i === 0) {
            label = "Today";
            shortLabel = "Today";
        } else if (i === 1) {
            label = "Tomorrow";
            shortLabel = "Tmrw";
        } else {
            label = date.toLocaleDateString([], { weekday: "long" });
            shortLabel = date.toLocaleDateString([], { weekday: "short" });
        }

        dates.push({
            date,
            label,
            shortLabel,
            dateStr: formatDate(date),
            dayNum: date.getDate().toString(),
        });
    }

    return dates;
}

function NoContent() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                <svg
                className="w-8 h-8 text-muted-foreground/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
                </svg>
            </div>
            <p className="text-muted-foreground/60 text-sm">
                No scheduled releases
            </p>
        </div>
    )
}

function Upcoming() {
    const weekDates = useMemo(() => getCurrentSevenDays(), [])
    const [selectedDate, setSelectedDate] = useState<DateObj>(weekDates[0])

    const { data: upcomingData, isLoading } = useQuery(
        orpc.anime.getEstimatedSchedule.queryOptions({
            input: { date: selectedDate.dateStr },
        })
    )
    const upcomingAnimes = upcomingData?.scheduledAnimes ?? []

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="my-12 px-4 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Upcoming Anime</h1>
                <p className="text-gray-400 text-lg">Discover exciting anime coming soon to AnimeHub</p>
            </div>

            <div className="flex gap-3 overflow-x-auto mb-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {weekDates.map((d) => (
                    <button
                        key={d.dateStr}
                        onClick={() => setSelectedDate(d)}
                        className={`px-4 py-2 rounded-lg min-w-20 text-center font-semibold transition-colors cursor-pointer ${
                        d.dateStr === selectedDate.dateStr
                            ? 'text-black bg-red-500'
                            : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        <div className="text-sm">{d.shortLabel}</div>
                        <div className="text-lg font-bold">{d.dayNum}</div>
                    </button>
                ))}
            </div>

            {/* Anime List */}
            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {selectedDate?.label}
                        </h2>
                        <span className="text-xs text-muted-foreground/60">
                            {upcomingAnimes.length} releases
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Spinner className="size-8 text-muted-foreground" />
                        </div>
                    ) : upcomingAnimes.length === 0 ? <NoContent /> : (
                        <ItemGroup className="gap-2">
                            {upcomingAnimes.map((anime) => (
                                <Item
                                    key={`${anime.id}-${anime.episode}`}
                                    asChild
                                    variant="outline"
                                    className="hover:border-pink/30 hover:bg-transparent! group"
                                >
                                    <Link href={anime.id ? `/anime/${anime.id}` : "#"}>
                                        {/* Time */}
                                        <div className="flex flex-col items-center justify-center shrink-0 min-w-15">
                                            <span className="text-lg font-semibold text-foreground tabular-nums">
                                                {formatTime(anime.airingTimestamp)}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-px h-10 bg-border" />

                                        <ItemContent>
                                            <ItemTitle className="group-hover:text-pink transition-colors line-clamp-1">
                                                {anime.name}
                                            </ItemTitle>
                                            {anime.jname && (
                                                <ItemDescription className="text-xs text-muted-foreground/50 line-clamp-1">
                                                {anime.jname}
                                                </ItemDescription>
                                            )}
                                        </ItemContent>

                                        <ItemActions>
                                            <span className="px-2.5 py-1 rounded-md bg-foreground/5 text-xs font-medium text-muted-foreground tabular-nums">
                                                EP {anime.episode}
                                            </span>
                                        </ItemActions>
                                    </Link>
                                </Item>
                            ))}
                        </ItemGroup>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Upcoming