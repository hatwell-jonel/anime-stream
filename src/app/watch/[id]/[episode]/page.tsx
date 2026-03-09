'use client';

import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Fragment, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  MediaProviderAdapter,
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
import AnimeCard from '@/components/ui/anime-card';
import { usePlayerPreferences } from '@/hooks/use-player-preferences';
import { useWatchProgress } from '@/hooks/use-watch-progress';
import { NextEpisodeCountdown } from '@/app/features/NextEpisodeCountdown';
import { useRouter } from 'next/navigation';

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


interface MenuToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function MenuToggle({ label, checked, onChange }: MenuToggleProps) {
  return (
    <div className="vds-menu-item" role="menuitemcheckbox" aria-checked={checked}>
      <div className="vds-menu-item-label">{label}</div>
      <div
        className="vds-menu-checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}


function WatchPage({ params }: PageProps) {

  const {id : animeId, episode : episodeId} = use(params);
  const router = useRouter();

  // REFS
  const playerRef = useRef<MediaPlayerInstance>(null);
  const { preferences, updatePreferences } = usePlayerPreferences();
  const hasRestoredRef = useRef(false);
  const sourcesDataRef = useRef<{
    intro?: { start: number; end: number } | null;
    outro?: { start: number; end: number } | null;
  }>({});
  const hasAutoSkippedIntroRef = useRef(false);
  const hasAutoSkippedOutroRef = useRef(false);
  const lastSaveTimeRef = useRef(0);
  const hasTriggeredAutoNextRef = useRef(false);
  const animeInfoRef = useRef<{ poster?: string; name?: string }>({});

  const { getProgress, saveProgress } = useWatchProgress();
  const [countdownForEpisode, setCountdownForEpisode] = useState<number | null>(null);
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


  // Derive whether to show countdown (only show for current episode)
  const showCountdown = countdownForEpisode === episodeId;

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

  const onProviderChange = useCallback(
    (provider: MediaProviderAdapter | null) => {
      if (isHLSProvider(provider)) {
        provider.config = {
          xhrSetup(xhr) {
            xhr.withCredentials = false;
          },
        };
      }
    },
    [],
  );

  // Restore saved progress and preferences when player is ready
  const onCanPlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    // Restore playback rate
    if (preferences.playbackRate !== 1) {
      player.playbackRate = preferences.playbackRate;
    }

    // Restore volume
    player.volume = preferences.volume;
    player.muted = preferences.muted;

    // Restore watch progress
    const progress = getProgress(animeId, episodeId);
    if (progress && progress.currentTime > 5) {
      // Only restore if we haven't finished (more than 60s remaining)
      const remaining = progress.duration - progress.currentTime;
      if (remaining > 60) {
        player.currentTime = progress.currentTime;
      }
    }
  }, [animeId, episodeId, preferences, getProgress]);

  // Save progress on time update (throttled to every 5 seconds) + auto-skip
  const onTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = player.currentTime;
    const duration = player.duration;

    // Save progress (throttled)
    if (Math.abs(currentTime - lastSaveTimeRef.current) >= 5) {
      lastSaveTimeRef.current = currentTime;
      saveProgress(
        animeId,
        episodeId,
        currentTime,
        duration,
        animeInfoRef.current,
      );
    }

    // Auto-skip intro/outro
    if (preferences.autoSkip) {
      const intro = sourcesDataRef.current.intro ?? null;
      const outro = sourcesDataRef.current.outro ?? null;

      // Check if in intro and should skip
      const isInIntro =
        intro &&
        intro.end > 0 &&
        currentTime >= intro.start &&
        currentTime < intro.end;
      if (isInIntro && !hasAutoSkippedIntroRef.current) {
        hasAutoSkippedIntroRef.current = true;
        player.currentTime = intro.end;
        return;
      }

      // Check if in outro and should skip
      const isInOutro =
        outro &&
        outro.end > 0 &&
        currentTime >= outro.start &&
        currentTime < outro.end;
      if (isInOutro && !hasAutoSkippedOutroRef.current) {
        hasAutoSkippedOutroRef.current = true;
        player.currentTime = outro.end;
      }
    }
  }, [animeId, episodeId, saveProgress, preferences.autoSkip]);

  // Save volume preference on change
  const onVolumeChange = useCallback(() => {
    const player = playerRef.current;
    if (!player || !hasRestoredRef.current) return;
    updatePreferences({ volume: player.volume, muted: player.muted });
  }, [updatePreferences]);

  // Save playback rate preference on change
  const onRateChange = useCallback(() => {
    const player = playerRef.current;
    if (!player || !hasRestoredRef.current) return;
    updatePreferences({ playbackRate: player.playbackRate });
  }, [updatePreferences]);

  // Save caption language preference on change
  const onTextTrackChange = useCallback(() => {
    const player = playerRef.current;
    if (!player || !hasRestoredRef.current) return;
    const activeTrack = player.textTracks.selected;
    updatePreferences({ captionLanguage: activeTrack?.label ?? null });
  }, [updatePreferences]);

  const totalEpisodes = allEpisodes.length;
  const chunkSize = 50;
  const prevEpisode = Number(episodeId) > 1 ? Number(episodeId) - 1 : null;
  const nextEpisode = Number(episodeId) < totalEpisodes ? Number(episodeId) + 1 : null;

  // Trigger auto-next countdown (used by both onEnded and onTimeUpdate)
  const triggerAutoNext = useCallback(() => {
    if (hasTriggeredAutoNextRef.current) return;
    if (nextEpisode && preferences.autoNextEpisode) {
      hasTriggeredAutoNextRef.current = true;
      setCountdownForEpisode(episodeId);
    }
  }, [nextEpisode, preferences.autoNextEpisode, episodeId]);

  
  // Handle video ended - trigger auto-next countdown
  const onEnded = useCallback(() => {
    triggerAutoNext();
  }, [triggerAutoNext]);

  // Handle seek to near end (e.g., skip outro) - trigger auto-next
  const onSeeked = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const { currentTime, duration } = player;
    // If seeked to within 3 seconds of end, trigger auto-next
    if (duration > 0 && duration - currentTime <= 3) {
      triggerAutoNext();
    }
  }, [triggerAutoNext]);

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

  // Cancel auto-next countdown
  const cancelCountdown = useCallback(() => {
    setCountdownForEpisode(null);
  }, []);

  // Navigate to next episode
  const navigateToNext = useCallback(() => {
    if (!nextEpisode) return;
    setCountdownForEpisode(null);
    router.push(
      `/watch/${animeId}/2?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`,
    );
  }, [animeId, nextEpisode, selectedCategory, selectedServer, selectedRange, router]);

  const info = currentAnime.data?.anime?.info;
  const moreInfo = currentAnime.data?.anime?.moreInfo;
  const relatedAnimes = currentAnime.data?.relatedAnimes ?? [];
  const seasons = currentAnime.data?.seasons ?? [];
  const anime = animeQtipInfo.data?.anime;
  const subServers = episodeServers.data?.sub ?? [];
  const dubServers = episodeServers.data?.dub ?? [];

  useEffect(() => {
    if (!info?.poster || !info?.name) return;
    animeInfoRef.current = {
      poster: info.poster,
      name: info.name,
    };
  }, [info?.poster, info?.name]);

  if (currentAnime.isLoading || animeQtipInfo.isLoading ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8 text-red-500" />
      </div>
    );
  }

  if (!info || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Anime info not found.</p>
      </div>
    );
  }

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
                      autoPlay={preferences.autoplay}
                      onProviderChange={onProviderChange}
                      onCanPlay={onCanPlay}
                      onTimeUpdate={onTimeUpdate}
                      onVolumeChange={onVolumeChange}
                      onRateChange={onRateChange}
                      onTextTrackChange={onTextTrackChange}
                      onEnded={onEnded}
                      onSeeked={onSeeked}
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
                        showSkip={preferences.autoSkip}
                      />

                      {showCountdown && nextEpisode && (
                        <NextEpisodeCountdown
                          nextEpisode={nextEpisode}
                          onCancel={cancelCountdown}
                          onPlayNow={navigateToNext}
                        />
                      )}

                      {
                        subtitles?.map((subtitle, index) => {
                          const isPreferredLang = preferences.captionLanguage
                          ? subtitle.lang
                              .toLowerCase()
                              .includes(
                                preferences.captionLanguage.toLowerCase(),
                              )
                          : false;
                        const isDefault = preferences.captionLanguage
                          ? isPreferredLang
                          : index === 0;

                          return (
                            <Track
                              key={`${subtitle.url}`}
                              src={getProxyUrl(subtitle.url)}
                              kind="subtitles"
                              label={subtitle.lang}
                              language={subtitle.lang.toLowerCase().slice(0, 2)}
                              default={isDefault}
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
                        slots={{
                          playbackMenuItemsEnd: (
                            <>
                              <MenuToggle
                                label="Auto Skip Intro/Outro"
                                checked={preferences.autoSkip}
                                onChange={(checked) =>
                                  updatePreferences({ autoSkip: checked })
                                }
                              />
                              <MenuToggle
                                label="Auto Play Next Episode"
                                checked={preferences.autoNextEpisode}
                                onChange={(checked) =>
                                  updatePreferences({ autoNextEpisode: checked })
                                }
                              />
                            </>
                          ),
                        }}
                      />
                    </MediaPlayer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Background Poster */}
                      <Image
                        src={getProxyUrl(String(info?.poster))}
                        alt={info?.name ?? "Poster"}
                        fill
                        className="object-cover opacity-30 blur-sm"
                      />

                      <div className="relative z-10 flex flex-col items-center gap-6 text-center bg-background/80 backdrop-blur-md px-8 py-8 rounded-xl border border-border shadow-lg">

                        {/* Icon */}
                        <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 9v2m0 4h.01M3.34 16l6.928-12a2 2 0 013.464 0L20.66 16A2 2 0 0118.928 19H5.072A2 2 0 013.34 16z"
                            />
                          </svg>
                        </div>

                        {/* Text */}
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Video unavailable
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Try switching to another server
                          </p>
                        </div>

                        {/* SERVER QUICK SWITCH */}
                        <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                          {(selectedCategory === "sub" ? subServers : dubServers).map((server) => {
                            const serverName = server.serverName
                            if (!isAnimeServer(serverName)) return null

                            return (
                              <button
                                key={serverName}
                                onClick={() => setSelectedServer(serverName)}
                                className={cn(
                                  "px-3 py-1.5 rounded-md text-xs font-medium transition",
                                  selectedServer === serverName
                                    ? "bg-red-500 text-white"
                                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                                )}
                              >
                                {serverName}
                              </button>
                            )
                          })}
                        </div>

                        {/* Hint */}
                        <p className="text-[11px] text-muted-foreground">
                          Current: <span className="font-medium">{selectedServer}</span>
                        </p>

                      </div>
                    </div>
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
                        className={`cursor-pointer px-3 md:px-4 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
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
                        className={`cursor-pointer px-3 md:px-4 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
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
                            className={`cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
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

                  <div className="hidden md:block w-px h-6 bg-foreground/10" />

                  <div className="flex items-center gap-1.5 md:gap-2 left-0">
                      {prevEpisode ? (
                        <Link
                          href={`/watch/${animeId}/${prevEpisode}?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`}
                        >
                            <div className="w-fit h-9 md:h-10 rounded-md flex items-center justify-center px-3 hover:bg-red-500 transition-colors">
                              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground/70" />
                              <span className="text-sm">Prev Ep</span>

                            </div>
                        </Link>
                      ) : (
                        <div className="w-fit h-9 md:h-10 rounded-md bg-foreground/2 flex items-center justify-center">
                          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground/70" />
                          <span className="text-sm">Prev Ep</span>
                        </div>
                      )}

                      <span>|</span>

                      {nextEpisode ? (
                        <Link
                          href={`/watch/${animeId}/${nextEpisode}?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`}
                        >
                            <div className="w-fit h-9 md:h-10 rounded-md bg-foreground/2 flex items-center justify-center px-3 hover:bg-red-500 transition-colors">
                              <span className="text-sm">Next Ep</span>
                              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground/70" />
                            </div>
                        </Link>
                      ) : (
                        <div className="w-fit h-9 md:h-10 rounded-md bg-foreground/2 flex items-center justify-center">
                          <span className="text-sm">Next Ep</span>
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground/70" />
                        </div>
                      )}
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
                          <span>{moreInfo?.status ?? "Unknown"}</span>
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
          <Fragment key={`${item.id}-${item.name}`}>
            <AnimeCard
              anime={item}
              episodeCount={episodeCount}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
