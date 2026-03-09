'use client'

import { Fragment } from 'react';
import Hero from '~/features/Hero'
import TopTen from './features/Topten'
import Link from 'next/link';
import { useWatchProgress, WatchProgress } from '@/hooks/use-watch-progress';
import Image from 'next/image';
import useHomepage from '@/hooks/use-homepage';
import AnimeCard from '@/components/ui/anime-card';


type AnimeItem = {
      id: string;
      name: string;
      poster: string;
      type?: string | null;
      jname?: string | null;
      episodes?: { sub: number | null; dub: number | null };
};

function formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ContinueWatchingGrid({
      items,
}: {
      items: Array<WatchProgress & { poster: string; name: string }>;
}) {
      return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {items.map((item) => {
                        const progress =
                              item.duration > 0 ? (item.currentTime / item.duration) * 100 : 0;
                        return (
                              <Link
                                    key={`${item.animeId}:${item.episodeNumber}`}
                                    href={`/watch/${item.animeId}/${item.episodeNumber}`}
                                    className="group block"
                              >
                                    <div className="relative aspect-3/4 rounded-md overflow-hidden bg-foreground/5">
                                          <Image
                                                src={item.poster}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                          />
                                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm text-xs font-medium">
                                                EP {item.episodeNumber}
                                          </div>

                                          <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0" />

                                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
                                                <div
                                                      className="h-full bg-red-500 transition-all"
                                                      style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                          </div>
                                    </div>
                                    <h3 className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                                          {item.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground/60">
                                          {formatTime(item.currentTime)} / {formatTime(item.duration)}
                                    </p>
                              </Link>
                        );
                  })}
            </div>
      );
}

export default function Home() {
      const { getAllRecentlyWatched } = useWatchProgress();
      const recentlyWatched = getAllRecentlyWatched(6);
      const continueWatchingItems = recentlyWatched.filter(
            (item): item is WatchProgress & { poster: string; name: string } =>
                  !!item.poster && !!item.name,
      );
      // const data = useHomepage();
      // const uniqueCompleted = Array.from(new Map((data?.latestCompletedAnimes ?? []).map((item) => [item.id, item])).values());
      return (
            <main className="min-h-screen bg-background text-foreground">
                  <Hero />
                  
                  <section className="px-4 md:px-8 py-12 space-y-12">
                        {continueWatchingItems.length > 0 && (
                              <>
                                    <h2 className="text-2xl font-medium uppercase tracking-wider mb-8">Continue Watching</h2>
                                    <ContinueWatchingGrid items={continueWatchingItems} />
                              </>
                        )}

                        <TopTen />

                        {/* <>
                              <h2 className="text-2xl font-medium uppercase tracking-wider mb-8">latest completed</h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                    {uniqueCompleted.map((item) => {
                                          const episodeCount = item.episodes?.sub ?? item.episodes?.dub ?? "?";
                                          return (
                                                <Fragment key={`${item.id}-${item.name}`}>
                                                      <AnimeCard
                                                            anime={item as AnimeItem}
                                                            episodeCount={episodeCount}
                                                      />
                                                </Fragment>
                                          );
                                    })}
                              </div>
                        </> */}

                        {/* <>
                              <h2 className="text-2xl font-medium uppercase tracking-wider mb-8">Most Favorites</h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                    {data?.mostFavoriteAnimes?.map((item) => {
                                          const episodeCount = item.episodes?.sub ?? item.episodes?.dub ?? "?";
                                          return (
                                                <Fragment key={`${item.id}-${item.name}`}>
                                                      <AnimeCard
                                                            anime={item as AnimeItem}
                                                            episodeCount={episodeCount}
                                                      />
                                                </Fragment>
                                          );
                                    })}
                              </div>
                        </> */}
{/* 
                        <>
                              <h2 className="text-2xl font-medium uppercase tracking-wider mb-8">Top Upcoming</h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                    {data?.topUpcomingAnimes?.map((item) => {
                                          const episodeCount = item.episodes?.sub ?? item.episodes?.dub ?? "?";
                                          return (
                                                <Fragment key={`${item.id}-${item.name}`}>
                                                      <AnimeCard
                                                            anime={item as AnimeItem}
                                                            episodeCount={episodeCount}
                                                      />
                                                </Fragment>
                                          );
                                    })}
                              </div>
                        </> */}

                  </section>
            </main>
      )
}
