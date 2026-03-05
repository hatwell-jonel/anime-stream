"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { orpc } from "@/lib/tanstackquery/orpc";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchAnime() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const { data: searchData, isLoading } = useQuery({
    ...orpc.anime.getAnimeSearchResults.queryOptions({
      input: { query: debouncedQuery, page: 1 },
    }),
    enabled: debouncedQuery.length >= 2,
  });

  const searchResults = (searchData?.animes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (animeId: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/anime/${animeId}`);
    },
    [router],
  );

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="gap-2 text-muted-foreground hover:text-foreground border-b border-neutral-300 rounded-b-none"
      >
          <Search className="w-4 h-4 text-red-500 font-bold" />
          Search
          <span className="ml-2 hidden md:inline text-xs bg-muted px-2 py-0.5 rounded">
            Ctrl K
          </span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="max-w-2xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl"
      >
        {/* Input */}
        <div className="px-4 pt-4">
          <CommandInput
            placeholder="Search anime..."
            value={query}
            onValueChange={setQuery}
            className="h-12 text-base"
          />
        </div>

        {/* Results */}
        <CommandList 
          className="
            max-h-100 overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-red-500
            dark:[&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
          {debouncedQuery.length < 2 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Start typing to search anime...
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : searchResults.length === 0 ? (
            <CommandEmpty>No anime found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Results">
              {searchResults.map((anime) => (
                <CommandItem
                  key={anime.id}
                  value={anime.name}
                  onSelect={() => handleSelect(anime.id)}
                  className="flex items-center gap-4 py-3 px-3 rounded-lg transition-all hover:bg-muted data-[selected=true]:bg-muted"
                >
                  {/* Poster */}
                  <div className="relative h-14 w-10 rounded-md overflow-hidden shrink-0 shadow">
                    <Image
                      src={anime.poster}
                      alt={anime.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      {anime.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {anime.type} • {anime.duration}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}