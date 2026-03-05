"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/tanstackquery/orpc";
import { useSavedSeries } from "@/hooks/use-save-series";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AnimeDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const {
    data: animeData,
    isLoading: infoLoading,
    error,
  } = useQuery(
    orpc.anime.getAnimeAboutInfo.queryOptions({
      input: { animeId: id },
    }),
  );

  const { isSaved, toggleSave } = useSavedSeries();
  const { getLastWatchedEpisode } = useWatchProgress();
  const lastWatched = getLastWatchedEpisode(id);

  if (error) notFound();

  if (infoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    );
  }

  const anime = animeData?.anime;
  if (!anime) notFound();

  const relatedAnime = animeData?.relatedAnimes ?? [];
  const recommendedAnime = animeData?.recommendedAnimes ?? [];

  const info = anime.info;
  const moreInfo = anime.moreInfo;

  if (!info.poster || !info.name) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HERO ================= */}
      <section className="relative isolate pb-10">
        {/* Background */}
        <div className="absolute inset-0 -z-10 h-[65vh] overflow-hidden">
          <Image
            src={info.poster}
            alt={info.name}
            fill
            className="object-cover blur-2xl scale-110 opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/60 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="relative w-44 md:w-60 aspect-3/4 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 shrink-0">
              <Image
                src={info.poster}
                alt={info.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {info.name}
              </h1>

              {moreInfo.japanese && (
                <p className="text-sm text-muted-foreground/70 mt-2">
                  {moreInfo.japanese}
                </p>
              )}

              {/* Pills */}
              <div className="flex flex-wrap gap-3 mt-6 mb-8">
                {info.stats?.episodes?.sub && (
                  <Badge variant={'secondary'}>
                    {info.stats.episodes.sub} Episodes
                  </Badge>
                )}
                {moreInfo.duration && (
                  <Badge variant={'secondary'}>
                    {moreInfo.duration}
                  </Badge>
                )}
                {moreInfo.studios && (
                  <Badge variant={'secondary'}>
                    {moreInfo.studios}
                  </Badge>
                )}
                {info.stats?.rating && (
                  <Badge className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                    {info.stats.rating}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className={cn(
                    "bg-transparent text-red-500 border border-red-500",
                    "hover:bg-red-500/40 hover:text-white  active:bg-red-500/20 active:text-red-500",
                  )}
                  size="lg"
                >
                  <Link
                    href={`/watch/${id}/${lastWatched?.episodeNumber ?? 1}`}
                    className="flex justify-center items-center gap-2"
                  >
                      <Play />
                      {lastWatched
                        ? `Continue EP ${lastWatched.episodeNumber}`
                        : "Watch Now"}
                  </Link>
                </Button>

                <Button
                  onClick={() =>
                    toggleSave({
                      id,
                      name: info.name,
                      poster: info.poster,
                    })
                  }
                  // className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium hover:bg-white/10 transition-all"
                  size="lg"
                  className="bg-white"
                >
                  {isSaved(id) ? "Saved" : "Save"}
                </Button>
              </div>

              {/* Genres */}
              {Array.isArray(moreInfo.genres) && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {moreInfo.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={'secondary'}
                      // className="px-3 py-1 rounded-full bg-foreground/5 text-xs"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-10">
          {/* Synopsis */}
          <div className="lg:col-span-2 z-50">
            <div className="bg-foreground/2 rounded-2xl p-6 border border-border">
              <h2 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                Synopsis
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {info.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white/3 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg h-fit">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
              Information
            </h3>
            <dl className="space-y-3 text-sm">
              {moreInfo.type && (
                <InfoRow label="Type" value={String(moreInfo.type)} />
              )}
              {moreInfo.status && (
                <InfoRow label="Status" value={String(moreInfo.status)} />
              )}
              {moreInfo.aired && (
                <InfoRow label="Aired" value={moreInfo.aired} />
              )}
              {moreInfo.duration && (
                <InfoRow label="Duration" value={String(moreInfo.duration)} />
              )}
              {moreInfo.studios && (
                <InfoRow label="Studio" value={moreInfo.studios} />
              )}
              {moreInfo.malscore && (
                <InfoRow label="MAL Score" value={String(moreInfo.malscore)} />
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* ================= GRID SECTION ================= */}
      <AnimeGrid title="Related Anime" data={relatedAnime} />
      <AnimeGrid title="You may also like" data={recommendedAnime} />
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <dt className="text-muted-foreground/60">{label}</dt>
      <dd className="text-right max-w-[60%] truncate">{value}</dd>
    </div>
  );
}

function AnimeGrid({
  title,
  data,
}: {
  title: string;
  data: any[];
}) {
  if (!data?.length) return null;

  return (
    <section className="py-12 px-4 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-sm font-medium text-muted-foreground uppercase mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
          {data
            .filter((item) => item.id && item.poster && item.name)
            .slice(0, 6)
            .map((item) => {
               const episodeCount = item.episodes?.sub ?? item.episodes?.dub ?? "?";
                return (
                  <Link
                    key={item.id}
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
                )
            })
          }
        </div>
      </div>
    </section>
  );
}