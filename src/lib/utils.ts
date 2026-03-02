import { animeServers, type TAnimeServer } from "@/types/anime.type";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


export function isAnimeServer(value: string): value is TAnimeServer {
  return animeServers.includes(value as TAnimeServer);
}