'use client';
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';

const MINUTE =  60 * 1000; // 1 minute in milliseconds

function useTopAnime() {

    const {data, isLoading} = useQuery({
        ...orpc.anime.getHomePage.queryOptions({}),
        staleTime: 5 * MINUTE,
    });

    const topTen = data?.top10Animes;

    const topTenToday = topTen?.today;
    const topTenWeek = topTen?.week;
    const topTenMonth = topTen?.month;


    return {
        isTop10Loading : isLoading,
        topTenToday,
        topTenWeek,
        topTenMonth,
    } 
}

export default useTopAnime


/**
 * NOTES:
 * staleTime in React Query defines how long the data fetched by a query is considered fresh.
 */