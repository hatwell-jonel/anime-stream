"use client";

import Image from "next/image";
import Link from "next/link";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { useSavedSeries } from "@/hooks/use-save-series";
import { sileo } from "sileo";

export default function SavedPage() {
  const { savedSeries, removeSaved } = useSavedSeries();
  const { getLastWatchedEpisode } = useWatchProgress();

  const sortedSeries = [...savedSeries].sort((a, b) => b.savedAt - a.savedAt);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-balance">Saved Series</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {sortedSeries.length} saved
            </p>
          </div>

          {/* EMPTY STATE */}
          {sortedSeries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">

              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-medium text-foreground mb-1">
                No saved series
              </h2>

              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Browse anime and save your favorites to continue watching later
              </p>

              <Link
                href="/library"
                className="px-5 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Explore Anime
              </Link>
            </div>
          ) : (

            /* GRID */
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">

              {sortedSeries.map((series) => {
                const progress = getLastWatchedEpisode(series.id);
                const progressPercent = progress
                  ? (progress.currentTime / progress.duration) * 100
                  : 0;

                const href = progress
                  ? `/watch/${series.id}/${progress.episodeNumber}`
                  : `/anime/${series.id}`;

                return (
                  <div key={series.id} className="group relative">

                    <Link href={href} className="block">

                      {/* POSTER */}
                      <div className="relative aspect-2/3 rounded-md overflow-hidden bg-foreground/5 shadow-sm">

                        <Image
                          src={series.poster}
                          alt={series.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />

                        {/* LAST WATCHED EP */}
                        {progress && (
                          <div className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded bg-black/70 text-white backdrop-blur-sm">
                            EP {progress.episodeNumber}
                          </div>
                        )}

                        {/* PROGRESS BAR */}
                        {progress && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-black/40">
                            <div
                              className="h-full bg-red-500 transition-all"
                              style={{
                                width: `${Math.min(progressPercent, 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* TITLE */}
                      <h3 className="mt-2 text-sm line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        {series.name}
                      </h3>

                    </Link>

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() => {
                        removeSaved(series.id)
                        sileo.success({
                          title: "Removed from saved",
                          fill: "green",
                          duration: 2000,
                          styles: {
                            title: "text-white!",
                            description: "text-white/75!",
                          },
                        });
                      }}
                      className="cursor-pointer absolute top-2 right-2 p-1.5 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove from saved"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                  </div>
                );
              })}
            </div>

          )}
        </div>
      </main>
    </div>
  );
}