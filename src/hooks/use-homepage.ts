'use client';
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';

const MINUTE =  60 * 1000; // 1 minute in milliseconds

function useHomepage() {

    const {data, isLoading} = useQuery({
        ...orpc.anime.getHomePage.queryOptions({}),
        staleTime: 5 * MINUTE,
    });

    const topTen = data?.top10Animes;

    const topTenToday = topTen?.today;
    const topTenWeek = topTen?.week;
    const topTenMonth = topTen?.month;
    const mostPopularAnimes = data?.mostPopularAnimes;
    const topUpcomingAnimes = data?.topUpcomingAnimes;
    const topAiringAnimes = data?.topAiringAnimes;
    const spotlightAnimes = data?.spotlightAnimes;
    const trendingAnimes = data?.trendingAnimes;
    const latestCompletedAnimes = data?.latestCompletedAnimes;
    const mostFavoriteAnimes = data?.mostFavoriteAnimes;


    return {
        isTop10Loading : isLoading,
        topTenToday,
        topTenWeek,
        topTenMonth,
        mostPopularAnimes,
        topUpcomingAnimes,
        topAiringAnimes,
        spotlightAnimes,
        trendingAnimes,
        latestCompletedAnimes,
        mostFavoriteAnimes
    } 
}

export default useHomepage


/**
 * NOTES:
 * staleTime in React Query defines how long the data fetched by a query is considered fresh.
 */