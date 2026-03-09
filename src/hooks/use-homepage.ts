'use client';

import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';

const MINUTE = 60 * 1000;

function useHomepage() {
    const { data, isLoading } = useQuery({
        ...orpc.anime.getHomePage.queryOptions({}),
        staleTime: 60 * MINUTE,
        gcTime: 2 * 60 * MINUTE,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        select: (data) => ({
            topTenToday: data.top10Animes?.today,
            topTenWeek: data.top10Animes?.week,
            topTenMonth: data.top10Animes?.month,
            mostPopularAnimes: data.mostPopularAnimes,
            topUpcomingAnimes: data.topUpcomingAnimes,
            topAiringAnimes: data.topAiringAnimes,
            spotlightAnimes: data.spotlightAnimes,
            trendingAnimes: data.trendingAnimes,
            latestCompletedAnimes: data.latestCompletedAnimes,
            mostFavoriteAnimes: data.mostFavoriteAnimes,
        }),
    });

    return {
        isTop10Loading: isLoading,
        ...data
    };
}

export default useHomepage;
/**
 * NOTES:
 * staleTime in React Query defines how long the data fetched by a query is considered fresh.
 */