import { getHomePage } from "./procedures/anime";

export const animeRouter = {
    anime: {
        getHomePage,
    }
}

export type TAnimeRouter = typeof animeRouter;