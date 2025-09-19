import { Button } from "@/components/ui/button";
import { useUserTasks } from "@/lib/providers/UserTaskProvider";
import { Asset } from "@/lib/types/asset";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function VideoFileCard({
  file,
  projectId,
}: {
  file: Asset;
  projectId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { getTasksForProject } = useUserTasks();
  const tasks = getTasksForProject(projectId);
  const videoTask = tasks.find(
    (task) =>
      task.status === "finished" &&
      task.result?.videoKey.split("/")[2] === file.originalName
  );
  const usedImages = videoTask?.params?.imageKeys ?? [];
  const usedAudios = videoTask?.params?.audioKeys ?? [];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetch the video blob
      const response = await fetch(file.downloadUrl);
      const blob = await response.blob();

      // Create object URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(file.downloadUrl, "_blank");
    } finally {
      setIsDownloading(false);
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
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Video Section */}
        <div className="relative lg:w-1/2 xl:w-2/5">
          <video
            ref={videoRef}
            src={file.downloadUrl}
            controls
            preload="metadata"
            controlsList="nodownload"
            className="w-full aspect-video object-cover"
          />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-xs font-medium">
              {file.metadata?.size ? `${file.metadata.size} MB` : "Video"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-8 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-zinc-900 line-clamp-2">
              {file.originalName}
            </h3>
            <p className="text-sm text-zinc-500">
              Created{" "}
              {new Date(file.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {usedImages.length}
                  </p>
                  <p className="text-xs text-zinc-500">Images</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {usedAudios.length}
                  </p>
                  <p className="text-xs text-zinc-500">Audio tracks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="gap-2"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
