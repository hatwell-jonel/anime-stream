import { orpc } from '@/lib/tanstackquery/orpc';
import { useQueries } from '@tanstack/react-query'
import React from 'react'


const MINUTE =  60 * 1000; // 1 minute in milliseconds

export function useAnimeList() {

    const getHomePageAnimeList = useQueries({
        ...orpc.anime.getHomePage.queryOptions(),
        staleTime: 5 * MINUTE,
    });

    return {

    }
}
