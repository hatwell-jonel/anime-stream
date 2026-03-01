import { TimeSlider } from "@vidstack/react";

export  function PlayerSlider() {
    return (
        <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
            <TimeSlider.Track className="relative ring-blue-500 z-0 h-1.25 w-full rounded-sm group-data-focus:ring-[3px] bg-0red">
                <TimeSlider.TrackFill className="bg-red-500  absolute h-full w-(--slider-fill) rounded-sm will-change-[width]" />
                <TimeSlider.Progress className=" absolute z-10 h-full w-(--slider-progress) rounded-sm bg-white/50 will-change-[width]" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 z-20 h-3.75 w-3.75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 opacity-0  transition-opacity group-data-active:opacity-100 group-data-dragging:ring-4 will-change-[left]" />
        </TimeSlider.Root>
    )
}