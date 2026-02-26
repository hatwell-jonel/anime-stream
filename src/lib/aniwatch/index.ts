import { HiAnime, HiAnimeError } from "aniwatch";

let scraperInstance: HiAnime.Scraper | undefined;

export function hiAnimeScraper(): HiAnime.Scraper {
    if (!scraperInstance) {
        try {
            scraperInstance = new HiAnime.Scraper();
        } catch (error) {
            console.error(error instanceof HiAnimeError, error);
            throw new Error("Scraper initialization failed: " + error);
        }
    }

    return scraperInstance;
}