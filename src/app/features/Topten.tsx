"use client";

import { Spinner } from "@/components/ui/spinner";
import useHomepage from "@/hooks/use-homepage";
import useTopAnime from "@/hooks/use-homepage";
import Image from "next/image";
import Link from "next/link";

function TopTen() {
  const { isTop10Loading, topTenToday } = useHomepage();

  if (isTop10Loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-8 text-red-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold uppercase">Top 10 Today</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
        {topTenToday?.map((anime, index) => {
          const episodeCount =
            anime.episodes?.sub ?? anime.episodes?.dub ?? "?";

          const rank = index + 1;

          return (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="group relative"
            >
              {/* BIG RANK NUMBER */}
              <span
                className="
                absolute -left-6 bottom-0
                text-[170px] font-black leading-none
                text-transparent
                [-webkit-text-stroke:3px_rgba(255,255,255,0.25)]
                select-none pointer-events-none
              "
              >
                {rank}
              </span>

              {/* POSTER */}
              <div className="relative ml-12 aspect-2/2.5 rounded-sm overflow-hidden shadow-lg">
                <Image
                  src={String(anime.poster)}
                  alt={String(anime.name)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0" />

                {/* Episode Badge */}
                <div className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded bg-black/70 text-white backdrop-blur-sm">
                  {episodeCount} EP
                </div>
              </div>

              {/* TITLE */}
              <h3 className="mt-3 text-sm font-medium line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors ml-12">
                {anime.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TopTen;