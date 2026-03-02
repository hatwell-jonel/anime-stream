'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { use, useRef } from 'react'
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
import { useQueryState, parseAsStringLiteral } from 'nuqs';
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

interface PageProps {
  params: Promise<{ id: string; episode: string }>;
}

interface WatchBreadcrumbProps {
  animeId: string;
  animeName: string;
  episodeId: string;
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

  const { 
    currentAnime,
    episodeServers,
    episodeSources,
    streamingSources,
    thumbnailTrack,
    subtitles
  } = useWatchAnime({ 
    animeId, 
    episodeId,
    selectedCategory,
    selectedServer,
  });

  const { info } = currentAnime.data?.anime ?? {};
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

          {/* Video Area */}
          <main className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col w-full">

              {/* Video Player */}
              <div className="relative rounded-lg md:rounded-2xl overflow-hidden">
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
              </div>

              {/* Server Selection */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl bg-foreground/2 border border-border">
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
              </div>

            </div>
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