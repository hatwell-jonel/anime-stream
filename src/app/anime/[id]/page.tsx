// import { MediaPlayer, MediaPlayerInstance, MediaProvider, Poster } from '@vidstack/react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { hiAnimeScraper } from '~/lib/aniwatch';
// import { getProxyUrl } from '~/lib/proxy';
// import ReactPlayer from 'react-player'

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// async function Page({ params }: PageProps) {
//     const title = "one-piece-100";
//     const scraper = hiAnimeScraper();
//     // INFO 
//     const data = await scraper.getInfo(title);
//     const anime = data.anime;

//     const info = anime.info;
//     const moreInfo = anime.moreInfo;

//     // EPISODES
//     const ep = await scraper.getEpisodes(title);
//     // console.log("ep", ep);

//     // EPISODE SERVER
//     const server = await scraper
//     .getEpisodeServers(String(ep.episodes[0].episodeId));
//     // console.log(server);

//     // EPISODE SOURCES
//     const sources = await scraper
//     .getEpisodeSources(String(ep.episodes[0].episodeId), 'hd-2', 'sub');
//     console.log("sources", sources.intro);

//     return (
//         <div>
//             <h1>{info.name}</h1>
//             <Link href={sources.sources[0]?.url}>{sources.sources[0]?.url}</Link>

//             <ReactPlayer 
//                 src={getProxyUrl(sources.sources[0]?.url)} 
//                 controls
                
//             />

//             <Image
//                 src={String(info.poster)}
//                 alt={String(info.name)}
//                 width={100}
//                 height={100}
//             />
//         </div>
//     )
// }

// export default Page;