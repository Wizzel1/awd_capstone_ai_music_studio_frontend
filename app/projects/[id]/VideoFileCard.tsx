import { Asset } from "@/lib/types/asset";
import { useEffect, useRef } from "react";

export default function VideoFileCard({ file }: { file: Asset }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div className="flex flex-row rounded-lg border-2 cursor-pointer transition-all overflow-hidden border-zinc-200 hover:border-zinc-300 hover:shadow-sm  md:p-4 ">
      <video
        ref={videoRef}
        src={file.downloadUrl}
        controls
        preload="metadata"
        controlsList="nodownload"
        className="aspect-video object-cover h-28 md:h-48 rounded-lg"
      />
      <div className="flex flex-col space-y-2 p-2 md:p-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-zinc-600">{file.originalName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-zinc-600">{file.createdAt}</p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-zinc-600">{file.metadata?.size} MB</p>
        </div>
      </div>
    </div>
  );
}
