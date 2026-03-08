import { Suspense } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { BrowseContent } from "./browse-content";

function BrowseLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
          <Image
            src="/images/bg-1.webp"
            alt=""
            fill
            className="object-cover opacity-50"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />

          {/* content */}
          <div className="absolute inset-0 flex items-end pb-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">

              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-16 bg-red-500 rounded-full" />
                <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
                  Anime Library
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white">
                Browse Anime
              </h1>

              <p className="text-gray-400 mt-2 max-w-lg">
                Discover trending, popular and newly released anime across all genres.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<BrowseLoading />}>
        <BrowseContent />
      </Suspense>

    </div>
  );
}