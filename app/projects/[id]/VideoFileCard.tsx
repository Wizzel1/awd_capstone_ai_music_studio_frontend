import { Asset } from "@/lib/types/asset";
import { useEffect, useRef } from "react";

export default function VideoFileCard({ file }: { file: Asset }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen =
      document.fullscreenElement === videoRef.current;
    if (!isCurrentlyFullscreen) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }
  }, []);

  return (
    <div className="relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden border-zinc-200 hover:border-zinc-300 hover:shadow-sm">
      <video
        ref={videoRef}
        src={"https://www.pexels.com/download/video/6769800/"}
        controls
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={handlePlay}
        controlsList="nodownload"
      />
    </div>
  );
}
