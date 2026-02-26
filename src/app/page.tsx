'use client'

import { getProxyUrl } from '@/lib/proxy';
import { orpc } from '@/lib/tanstackquery/orpc';
import { useQuery } from '@tanstack/react-query';
import  Header  from '~/features/Header'
import Hero from '~/features/Hero'

// import { Hero } from '@/components/hero'
// import { CategorySlider } from '@/components/category-slider'
// import { AnimeGrid } from '@/components/anime-grid'

export default function Home() {
      return (
            <main className="min-h-screen bg-background text-foreground">
                  <Header />
                  <Hero />
                  
                  {/* <section className="px-4 md:px-8 py-12 space-y-12">
                        <div>
                              <h2 className="text-3xl font-bold mb-6 text-balance">Trending Now</h2>
                              <AnimeGrid />
                        </div>

                        <div>
                              <h2 className="text-3xl font-bold mb-6 text-balance">Action & Adventure</h2>
                              <CategorySlider category="action" />
                        </div>

                        <div>
                              <h2 className="text-3xl font-bold mb-6 text-balance">Romance & Slice of Life</h2>
                              <CategorySlider category="romance" />
                        </div>

                        <div>
                              <h2 className="text-3xl font-bold mb-6 text-balance">Mystery & Thriller</h2>
                              <CategorySlider category="mystery" />
                        </div>
                  </section> */}
            </main>
      )
}


// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { orpc } from '~/lib/tanstackquery/orpc';
// import ReactPlayer from 'react-player'
// import { getProxyUrl } from '~/lib/proxy';

// function Page() {
//       // HOME
//       const { data: homeData, isLoading: homeLoading } = useQuery(
//             orpc.anime.getHomePage.queryOptions({}),
//       );
//       // console.log(homeData);

//       // LIST
//       const { data: azListData, isLoading: azListLoading } = useQuery(
//             orpc.anime.getAZList.queryOptions({
//                   input: {
//                         letter: "all",
//                   },
//             }),
//       );
//       // console.log(azListData);

//       // QTIP
//       const { data: qtipData, isLoading: qtipLoading } = useQuery(
//             orpc.anime.getQtipInfo.queryOptions({
//                   input: {
//                         animeId: "one-piece-100",
//                   },
//             }),
//       );
//       // console.log(qtipData);

//       // ABOUT
//       const { data: aboutData, isLoading: aboutLoading } = useQuery(
//             orpc.anime.getAnimeAboutInfo.queryOptions({
//                   input: {
//                         animeId: "one-piece-100",
//                   },
//             }),
//       );
//       // console.log(aboutData);

//       // SEARCH
//       const { data: searchData, isLoading: searchLoading } = useQuery(
//             orpc.anime.getAnimeSearchResults.queryOptions({
//                   input: {
//                         query: "one piece",
//                   },
//             }),
//       );
//       // console.log(searchData);

//       // SEARCH SUGGESTION
//       const { data: searchSuggestionData, isLoading: searchSuggestionLoading } = useQuery(
//             orpc.anime.getAnimeSearchSuggestion.queryOptions({
//                   input: {
//                         query: "attack",
//                   },
//             }),
//       );
//       // console.log(searchSuggestionData);

//       // PRODUCER
//       const { data: producerData, isLoading: producerLoading } = useQuery(
//             orpc.anime.getProducerAnimes.queryOptions({
//                   input: {
//                         producer: "toei-animation",
//                   },
//             }),
//       );
//       // console.log(producerData);

//       // GENRE
//       const { data: genreData, isLoading: genreLoading } = useQuery(
//             orpc.anime.getGenreAnime.queryOptions({
//                   input: {
//                         genre: "action",
//                   },
//             }),
//       );
//       // console.log("genreData", genreData);

//       // CATEGORY
//       const { data: categoryData, isLoading: categoryLoading } = useQuery(
//             orpc.anime.getAnimeCategory.queryOptions({
//                   input: {
//                         category: "movie",
//                   },
//             }),
//       );
//       // console.log("categoryData", categoryData);

//       // SCHEDULE
//       const { data: estimatedScheduleData, isLoading: estimatedScheduleLoading } = useQuery(
//             orpc.anime.getEstimatedSchedule.queryOptions({
//                   input: {
//                         date: "2026-02-01",
//                   },
//             }),
//       );
//       // console.log(estimatedScheduleData);

//       // NEXT EPISODE
//       const { data: nextEpisodeData, isLoading: nextEpisodeLoading } = useQuery(
//             orpc.anime.getNextEpisodeSchedule.queryOptions({
//                   input: {
//                         animeId: "one-piece-100",
//                   },
//             }),
//       );
//       // console.log(nextEpisodeData);

//       // EPISODES
//       const { data: episodesData, isLoading: episodesLoading } = useQuery(
//             orpc.anime.getAnimeEpisodes.queryOptions({
//                   input: {
//                         animeId: "one-piece-100",
//                   },
//             }),
//       );
//       // console.log(episodesData);

//       const { data: episodeServersData, isLoading: episodeServersLoading } = useQuery(
//             orpc.anime.getEpisodeServers.queryOptions({
//                   input: {
//                         episodeId: "steinsgate-0-92?ep=2055",
//                   },
//             }),
//       );
//       // console.log(episodeServersData);

//       const { data: episodeSourcesData, isLoading: episodeSourcesLoading } = useQuery(
//             orpc.anime.getAnimeEpisodeSources.queryOptions({
//                   input: {
//                         episodeId: "one-piece-100?ep=2142",
//                         server: "hd-2",
//                         category: "dub",
//                   },
//             }),
//       );
//       console.log(getProxyUrl(String(episodeSourcesData?.sources?.[0]?.url)));

      
//       return (
//             <div>
//                   <ReactPlayer src={getProxyUrl(String(episodeSourcesData?.sources?.[0]?.url))} controls />
//             </div>
//       )
// }

// export default Page