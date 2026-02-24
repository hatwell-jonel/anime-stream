import { os } from "@orpc/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getHomePage = os.handler(async () => {
    const data = await hianime.getHomePage();
    return data;
});




// getAZList
// getQtipInfo
// getAnimeAboutInfo
// getAnimeSearchResults
// getAnimeSearchSuggestion
// getProducerAnimes
// getGenreAnime
// getAnimeCategory
// getEstimatedSchedule
// getNextEpisodeSchedule
// getAnimeEpisodes
// getEpisodeServers
// getAnimeEpisodeSources