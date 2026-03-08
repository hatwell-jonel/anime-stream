"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/tanstackquery/orpc";
import AnimeCard from "@/components/ui/anime-card";
import { Fragment } from "react/jsx-runtime";

const categories = [
    { id: "most-popular", label: "Popular" },
    { id: "most-favorite", label: "Favorite" },
    { id: "top-airing", label: "Airing" },
    { id: "recently-updated", label: "Updated" },
    { id: "recently-added", label: "New" },
    { id: "top-upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
    { id: "subbed-anime", label: "Sub" },
    { id: "dubbed-anime", label: "Dub" },
    { id: "movie", label: "Movies" },
    { id: "tv", label: "TV" },
    { id: "ova", label: "OVA" },
    { id: "ona", label: "ONA" },
    { id: "special", label: "Special" },
] as const;

const categoryIds = categories.map((c) => c.id);
type CategoryId = (typeof categories)[number]["id"];

export function BrowseContent() {
    const [category, setCategory] = useQueryState(
        "category",
        parseAsStringLiteral(categoryIds).withDefault("most-popular"),
    );

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useInfiniteQuery(
        orpc.anime.getAnimeCategory.infiniteOptions({
            input: (pageParam: number) => ({
            category: category as CategoryId,
            page: pageParam,
            }),
            getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
            initialPageParam: 1,
        }),
        );

    const animes =
        data?.pages.flatMap((page) =>
        (page.animes ?? []).filter(
            (
            item,
            ): item is typeof item & { id: string; name: string; poster: string } =>
            item.id !== null && item.name !== null && item.poster !== null,
        ),
        ) ?? [];


    const currentCategory = categories.find((c) => c.id === category);

    return (
        <>
            {/* Category Filter */}
            <section className="sticky top-16 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="flex gap-2 py-4 overflow-x-auto anime-scrollbar">

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${
                            category === cat.id
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}

                </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24">
                            <Spinner className="size-8 text-red-500" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {currentCategory?.label}
                                </h2>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">

                                {animes.map((anime) => {
                                    const episodeCount = anime.episodes?.sub ?? anime.episodes?.dub ?? "?";

                                    return (
                                        <Fragment key={anime.id}>
                                            <AnimeCard 
                                                anime={anime}
                                                episodeCount={episodeCount}
                                            />
                                        </Fragment>
                                    )
                                }
                                )}

                            </div>

                            {/* Load More */}
                            {hasNextPage && (
                                <div className="flex justify-center mt-14">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="cursor-pointer px-7 py-2.5 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60"
                                >
                                    {isFetchingNextPage ? (
                                    <span className="flex items-center gap-2">
                                        <Spinner className="size-4" />
                                        Loading...
                                    </span>
                                    ) : (
                                    "Load More"
                                    )}
                                </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}