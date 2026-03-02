'use client'
import { Spinner } from '@/components/ui/spinner';
import { getProxyUrl } from '@/lib/proxy';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, Poster } from '@vidstack/react';
import React from 'react'
import SkipButton from './skip-button';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

interface VideoPlayerProps {
    playerRef: React.RefObject<MediaPlayerInstance>;
    episodeSourcesLoading: boolean;
    streamingSources: any[];
}


function VideoPlayer({
    playerRef,
    streamingSources,
    episodeSourcesLoading,
} : VideoPlayerProps) {
    return (
            <div className="relative rounded-lg md:rounded-2xl overflow-hidden">
                    <div className="aspect-video relative">
                        {
                            episodeSourcesLoading ? <LoadingState /> 
                            : streamingSources.length > 0 ? (
                                <MediaPlayer
                                    ref={playerRef}
                                    key={streamingSources[0]?.url}
                                    src={{
                                        src: getProxyUrl(streamingSources[0]?.url),
                                        type: "application/x-mpegurl",
                                    }}
                                    playsInline
                                    viewType="video"
                                    streamType="on-demand"
                                    crossOrigin="anonymous"
                                    // autoPlay={preferences.autoplay}
                                    // onProviderChange={onProviderChange}
                                    // onCanPlay={onCanPlay}
                                    // onTimeUpdate={onTimeUpdate}
                                    // onVolumeChange={onVolumeChange}
                                    // onRateChange={onRateChange}
                                    // onTextTrackChange={onTextTrackChange}
                                    // onEnded={onEnded}
                                    // onSeeked={onSeeked}
                                    className="w-full h-full [--media-slider-track-fill-bg:var(--color-red-500)]"
                                >
                                    <MediaProvider >
                                        <Poster
                                            className="vds-poster object-cover object-center"
                                            src={getProxyUrl(String(info?.poster))}
                                            alt={info?.name ?? "Poster"}
                                        />
                                    </MediaProvider>

                                    <SkipButton 
                                        intro={episodeSourcesData?.intro ?? null} 
                                        outro={episodeSourcesData?.outro ?? null}
                                        showSkip={true}
                                    />

                                    {
                                        subtitles?.map((subtitle) => {
                                        return (
                                            <Track
                                            key={`${subtitle.url}`}
                                            src={getProxyUrl(subtitle.url)}
                                            kind="subtitles"
                                            label={subtitle.lang}
                                            language={subtitle.lang.toLowerCase().slice(0, 2)}
                                            default={false}
                                            />
                                        )
                                        })
                                    }
                                    <DefaultVideoLayout
                                        icons={defaultLayoutIcons}
                                        thumbnails={
                                        thumbnailTrack
                                            ? getProxyUrl(thumbnailTrack.url)
                                            : undefined
                                        }
                                    />
                                </MediaPlayer>
                            ) : (
                                <h1>No Streams</h1>
                            )
                        } 
                    </div>
            </div>
    )
}

export default VideoPlayer


function LoadingState() {
    return (   
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-4">
                <Spinner className="size-8 text-red-500" />
                <p className="text-sm text-foreground/40">
                    Loading stream...
                </p>
            </div>
        </div>
    )
}