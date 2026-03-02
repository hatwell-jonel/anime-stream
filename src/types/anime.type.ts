
export const animeServers = [
    "hd-1",
    "hd-2",
    "megacloud",
    "streamsb",
    "streamtape",
] as const;
export type TAnimeServer = (typeof animeServers)[number];


export const animeAudioTypes = [
    "dub",
    "sub",
] as const;
export type TAnimeAudio = (typeof animeAudioTypes)[number];