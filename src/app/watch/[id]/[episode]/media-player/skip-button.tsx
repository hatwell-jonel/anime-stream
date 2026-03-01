'use client';

import { cn } from "@/lib/utils";
import { useMediaRemote, useMediaState } from "@vidstack/react";

interface Segment {
    start: number;
    end: number;
}

interface SkipButtonProps {
    intro: Segment | null;
    outro: Segment | null;
    showSkip?: boolean;
}

export default function SkipButton({
    intro,
    outro,
    showSkip,
}: SkipButtonProps) {
    const currentTime = useMediaState("currentTime");
    const remote = useMediaRemote();

    // Hide button if showSkip is disabled
    if (!showSkip) return null;

    const getActiveSegment = (
        segment: Segment | null,
        time: number
    ): Segment | null => {
        if (!segment || segment.end <= 0) return null;
        return time >= segment.start && time < segment.end ? segment : null;
    };

    const activeIntro = getActiveSegment(intro, currentTime);
    const activeOutro = getActiveSegment(outro, currentTime);

    const activeSegment = activeIntro ?? activeOutro;
    if (!activeSegment) return null;

    const label = activeIntro ? "Skip Intro" : "Skip Outro";

    return (
        <button
            onClick={() => remote.seek(activeSegment.end)}
            className={
                cn(
                    "absolute bottom-20 right-4 z-50 px-4 py-2",
                    " bg-white/90 hover:bg-white",
                    "text-black text-sm font-medium",
                    "rounded-md shadow-lg",
                    "transition-all hover:scale-105",
                    "cursor-pointer",
                )
            }
        >
            {label}
        </button>
    );
}