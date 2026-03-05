'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { use, useMemo, useRef } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getProxyUrl } from '@/lib/proxy';
import { Spinner } from '@/components/ui/spinner';
import { useQueryState, parseAsStringLiteral, parseAsInteger } from 'nuqs';
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaPlayerInstance,
} from "@vidstack/react"
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { cn, isAnimeServer } from '@/lib/utils';
import SkipButton from './media-player/skip-button';
import Image from 'next/image';
import useWatchAnime from '@/hooks/use-watch-anime';
import { animeAudioTypes, animeServers } from '@/types/anime.type';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ id: string; episode: number }>;
}

interface WatchBreadcrumbProps {
  animeId: string;
  animeName: string;
  episodeId: number;
}


function WatchBreadcrumb(data: WatchBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="w-5 h-5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Anime Page */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/anime/${data.animeId}`}>
              {data.animeName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Current Episode */}
        <BreadcrumbItem>
          <BreadcrumbPage>
            EP {data.episodeId}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function WatchPage({ params }: PageProps) {

  const playerRef = useRef<MediaPlayerInstance>(null);
  const {id : animeId, episode : episodeId} = use(params);

  const [selectedCategory, setSelectedCategory] = useQueryState(
    "category",
    parseAsStringLiteral(animeAudioTypes).withDefault("sub"),
  );  

  const [selectedServer, setSelectedServer] = useQueryState(
    "server",
    parseAsStringLiteral(animeServers).withDefault("hd-2"),
  );

  const [selectedRange, setSelectedRange] = useQueryState(
    "range",
    parseAsInteger.withDefault(0),
  );

  const { 
    currentAnime,
    animeQtipInfo,
    currentAnimeEpisodeLoading,
    episodeServers,
    episodeSources,
    streamingSources,
    thumbnailTrack,
    subtitles,
    allEpisodes
  } = useWatchAnime({ 
    animeId, 
    episodeId,
    selectedCategory,
    selectedServer,
  });

  const totalEpisodes = allEpisodes.length;

  // /* Generate episode ranges (99 per chunk) */
  // const episodeRanges = useMemo(() => {
  //  if (totalEpisodes <= 99)
  //     return [{ start: 1, end: totalEpisodes, label: "All" }];

  //   const chunkSize = 99;
  //   const ranges: { start: number; end: number; label: string }[] = [];

  //   for (let i = 0; i < totalEpisodes; i += chunkSize) {
  //     const start = i + 1;
  //     const end = Math.min(i + chunkSize, totalEpisodes);
  //     ranges.push({ start, end, label: `${start}-${end}` });
  //   }

  //   return ranges;
  // }, [totalEpisodes]);

  //  /*Auto-select range containing current episode */
  // const activeRangeIndex = useMemo(() => {
  //   return episodeRanges.findIndex(
  //     (range) => episodeId >= range.start && episodeId <= range.end
  //   );
  // }, [episodeRanges, episodeId]);
  
  // /* Use user-selected range or auto-detected range */
  // const effectiveRange =
  //   selectedRange >= 0 && selectedRange < episodeRanges.length
  //     ? selectedRange
  //     : Math.max(0, activeRangeIndex);


  // const filteredEpisodes = useMemo(() => {
  //   const range = episodeRanges[effectiveRange];
  //   if (!range) return allEpisodes;
  //   return allEpisodes.filter(
  //     (ep) => ep.number >= range.start && ep.number <= range.end,
  //   );
  // }, [allEpisodes, episodeRanges, effectiveRange]);

  const chunkSize = 50;

const episodeRanges = useMemo(() => {
  if (!totalEpisodes) return [];

  if (totalEpisodes <= chunkSize) {
    return [{ start: 1, end: totalEpisodes }];
  }

  const ranges = [];
  for (let i = 0; i < totalEpisodes; i += chunkSize) {
    ranges.push({
      start: i + 1,
      end: Math.min(i + chunkSize, totalEpisodes),
    });
  }

  return ranges;
}, [totalEpisodes]);

const autoRangeIndex = useMemo(() => {
  return episodeRanges.findIndex(
    (r) => episodeId >= r.start && episodeId <= r.end
  );
}, [episodeRanges, episodeId]);

const activeRange =
  selectedRange ?? (autoRangeIndex >= 0 ? autoRangeIndex : 0);

const filteredEpisodes = useMemo(() => {
  const range = episodeRanges[activeRange];
  if (!range) return allEpisodes;

  return allEpisodes.filter(
    (ep) => ep.number >= range.start && ep.number <= range.end
  );
}, [allEpisodes, episodeRanges, activeRange]);


  if (currentAnime.isLoading || animeQtipInfo.isLoading ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8 text-red-500" />
      </div>
    );
  }

  if (!currentAnime.data?.anime?.info || !animeQtipInfo.data?.anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Anime info not found.</p>
      </div>
    );
  }

  const { relatedAnimes, seasons } = currentAnime.data;
  const { info, moreInfo } = currentAnime.data.anime;
  const { anime } = animeQtipInfo.data;
  const subServers = episodeServers.data?.sub ?? [];
  const dubServers = episodeServers.data?.dub ?? [];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Layout */}
      <div className={cn(
          "flex justify-center",
          "min-h-screen",
          "pt-14 md:pt-16 pb-6 md:pb-8 px-4 md:px-6",
      )}>
        <div className="flex flex-col gap-2 w-full max-w-325">

          <WatchBreadcrumb   
            animeId={animeId} 
            animeName={info?.name ?? ""}
            episodeId={episodeId} 
          />

          <main className="flex-1 flex flex-col">

              {/* Video Player */}
              <section className="relative rounded-lg md:rounded-2xl overflow-hidden ">
                <div className="aspect-video relative">
                  {episodeSources.isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="flex flex-col items-center gap-4">
                        <Spinner className="size-8 text-red-500" />
                        <p className="text-sm text-foreground/40">
                          Loading stream...
                        </p>
                      </div>
                    </div>
                  ) : streamingSources.length > 0 ? (
                    <MediaPlayer
                      ref={playerRef}
                      key={`${episodeId}-${selectedServer}-${selectedCategory}`}
                      src={{
                        src: getProxyUrl(streamingSources[0]?.url),
                        type: "application/x-mpegurl",
                      }}
                      playsInline
                      viewType="video"
                      streamType="on-demand"
                      crossOrigin="anonymous"
                      // autoPlay={preferences.autoplay}
                      // onProviderChange={onProviderChange}
                      // onCanPlay={onCanPlay}
                      // onTimeUpdate={onTimeUpdate}
                      // onVolumeChange={onVolumeChange}
                      // onRateChange={onRateChange}
                      // onTextTrackChange={onTextTrackChange}
                      // onEnded={onEnded}
                      // onSeeked={onSeeked}
                      className="w-full h-full [--media-slider-track-fill-bg:var(--color-red-500)]"
                    >

                      <MediaProvider >
                        <Poster
                          className="vds-poster object-cover object-center"
                          src={getProxyUrl(String(info?.poster))}
                          alt={info?.name ?? "Poster"}
                        />
                      </MediaProvider>

                      <SkipButton 
                        intro={episodeSources.data?.intro ?? null} 
                        outro={episodeSources.data?.outro ?? null}
                        showSkip={true}
                      />

                      {
                        subtitles?.map((subtitle) => {
                          return (
                            <Track
                              key={`${subtitle.url}`}
                              src={getProxyUrl(subtitle.url)}
                              kind="subtitles"
                              label={subtitle.lang}
                              language={subtitle.lang.toLowerCase().slice(0, 2)}
                              default={true}
                            />
                          )
                        })
                      }
                      <DefaultVideoLayout
                        icons={defaultLayoutIcons}
                        thumbnails={
                          thumbnailTrack
                            ? getProxyUrl(thumbnailTrack.url)
                            : undefined
                        }
                      />
                    </MediaPlayer>
                  ) : (
                    <>
                      <Image
                        src={String(info?.poster)}
                        alt={`${String(info?.name)}`}
                        fill
                        className="object-cover opacity-30 blur-sm"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-6 h-6 text-foreground/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <p className="text-foreground/60 text-sm mb-1">
                            Video unavailable
                          </p>
                          <p className="text-foreground/30 text-xs">
                            Try to select different server
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Server Selection */}
              <section className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl bg-foreground/2 border border-border">
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  {/* Audio Toggle */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] md:text-xs text-foreground/40 uppercase tracking-wider">
                      Audio
                    </span>
                    <div className="flex rounded-lg bg-foreground/3 p-0.5 md:p-1">
                      <button
                        onClick={() => setSelectedCategory("sub")}
                        disabled={subServers.length === 0}
                        className={`px-3 md:px-4 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
                          selectedCategory === "sub"
                            ? "bg-foreground/10 text-foreground shadow-sm"
                            : "text-foreground/50 hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed"
                        }`}
                      >
                        SUB
                      </button>
                      <button
                        onClick={() => setSelectedCategory("dub")}
                        disabled={dubServers.length === 0}
                        className={`px-3 md:px-4 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
                          selectedCategory === "dub"
                            ? "bg-foreground/10 text-foreground shadow-sm"
                            : "text-foreground/50 hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed"
                        }`}
                      >
                        DUB
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-6 bg-foreground/10" />

                  {/* Servers */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] md:text-xs text-foreground/40 uppercase tracking-wider">
                      Server
                    </span>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {(selectedCategory === "sub"
                        ? subServers
                        : dubServers
                      ).map((server) => {
                        const serverName = server.serverName;
                        if (!isAnimeServer(serverName)) return null;
                        return (
                          <button
                            key={serverName}
                            onClick={() => setSelectedServer(serverName)}
                            className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
                              selectedServer === serverName
                                ? "bg-foreground text-background"
                                : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground/80"
                            }`}
                          >
                            {serverName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Episode Info */}
              <section className='mt-10'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className='flex  gap-1'>
                    <div>
                        <Image 
                          src={getProxyUrl(String(info.poster))}
                          width={300}
                          height={300}
                          alt={`${info.name}`}
                        />
                    </div>
                    <div className='px-4 w-full'>

                      <div className='gap-3 mb-2'>
                        <h3 className='font-bold text-2xl'>{anime.name}</h3>
                        <h4 className='text-xl'>( {anime.jname} )</h4>
                      </div>

                      <ul className='flex flex-col gap-2'>
                        <li className='text-sm  flex gap-2 text-stone-300'>
                          <span>Status:</span>
                          <span>{moreInfo.status}</span>
                        </li>
                        <li className='text-sm flex gap-2 text-stone-300'>
                          <span>Aired:</span>
                          <span>{anime.aired}</span>
                        </li>
                        <li className='text-sm  flex gap-2 text-stone-300'>
                          <span>Genres:</span>
                          <span>{anime.genres.join(", ")}</span>
                        </li>

                        <li className='text-sm flex gap-2 text-stone-300'>
                          <span>Rating:</span>
                            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                              {info.stats?.rating}
                            </span>
                        </li>
                        <li className='text-sm  flex gap-2 text-stone-300'>
                          <span>Quality:</span>
                          <span>{anime.quality}</span>
                        </li>
                        <li className='text-sm  flex gap-2 text-stone-300'>
                        <span>Type:</span>
                        <span>{anime.type}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-xl p-4">
                    <div className="border-b border-border">

                      {/* EPISODES RANGE*/}
                      <div className="py-3 border-b border-border">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold tracking-wide">
                            Episodes
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {totalEpisodes} Episodes
                          </span>
                        </div>

                        {episodeRanges.length > 1 && (
                          <div className="flex items-center flex-wrap gap-2 ">
                            {episodeRanges.map((range, index) => {
                              const isActive = activeRange === index;

                              return (
                                <Button
                                  key={`${range.start}-${range.end}`}
                                  onClick={() => setSelectedRange(index)}
                                  className={cn(
                                    "px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors",
                                    isActive
                                      ? "bg-red-500 text-white font-bold"
                                      : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                                  )}
                                >
                                  {range.start} – {range.end}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* EPISODES LIST*/}
                      <div className="mt-4">
                        {currentAnimeEpisodeLoading ? (
                          <div className="py-10 flex items-center justify-center">
                            <Spinner className="size-6 text-foreground/30" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {filteredEpisodes.map((ep) => {
                              const isActive = ep.number == episodeId;
                              console.log(isActive);
                              return (
                                <Link
                                  key={ep.episodeId}
                                  href={`/watch/${animeId}/${ep.number}?category=${selectedCategory}&server=${selectedServer}&range=${activeRange}`}
                                  className={cn(
                                    "h-10 flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                                    isActive
                                      ? "bg-red-500 text-white shadow-md font-bold"
                                      : ep.isFiller
                                        ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                        : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                                  )}
                                >
                                  {ep.number}
                                </Link>
                              );
                            })}
                          </div>
                          
                        )}
                        <div className="flex items-center gap-4 my-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-red-500" />
                            <span className="text-[10px] text-foreground/40">
                              Current
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-amber-500/30" />
                            <span className="text-[10px] text-foreground/40">
                              Filler
                            </span>
                          </div>
                        </div>
                      </div>  
                    </div>
                  </div>
                </div>
              </section>

              
              <section className="mt-15">
                {
                  seasons.length > 0 && (
                    <div className=" mx-auto max-w-7xl">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          Seasons
                        </h2>
                      </div>
                      <AnimeGrid 
                        anime={seasons as AnimeItem[]}
                        isLoading={currentAnime.isLoading} 
                      />
                  </div>
                  )
                }

                {
                  relatedAnimes.length > 0 && (
                    <div className="mx-auto max-w-7xl mt-15">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          Related
                        </h2>
                        <Link
                          href="/browse"
                          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                        >
                          View all
                        </Link>
                      </div>
                      <AnimeGrid 
                        anime={relatedAnimes as AnimeItem[]}
                        isLoading={currentAnime.isLoading} 
                      />
                    </div>
                  )
                }
              </section>
          </main>
        </div>
      </div>



      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(0.98 0 0 / 10%);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: oklch(0.98 0 0 / 20%);
        }
      `}</style>
    </div>
  );
}

export default WatchPage

type AnimeItem = {
  id: string;
  name: string;
  poster: string;
  type?: string | null;
  jname?: string | null;
  episodes?: { sub: number | null; dub: number | null };
};


function AnimeGrid({
  anime,
  isLoading,
}: {
  anime: AnimeItem[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  const uniqueAnime = Array.from(
    new Map(anime.map((item) => [item.id, item])).values()
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {uniqueAnime.map((item) => {
        const episodeCount = item.episodes?.sub ?? item.episodes?.dub ?? "?";
        return (
          <Link
            key={`${item.id}-${item.name}`}
            href={`/anime/${item.id}`}
            className="group block"
          >
            <div className="relative aspect-3/4 rounded-sm overflow-hidden bg-foreground/5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">

              {/* Poster */}
              <Image
                src={item.poster}
                alt={item.name}
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
              {item.type && (
                <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-md bg-red-500/75 text-white font-bold">
                  {item.type}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="mt-3 text-sm font-medium line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors min-h-10">
              {item.name}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}