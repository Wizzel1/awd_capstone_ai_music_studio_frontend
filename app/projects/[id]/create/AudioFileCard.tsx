import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/lib/providers/AudioPlaybackProvider";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { Asset } from "@/lib/types/asset";
import { cn } from "@/lib/utils";
import { Music, Pause, Play } from "lucide-react";
import { useState } from "react";

/**
 * Formats the time in seconds into a readable format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

interface AudioCardProps {
  file: Asset;
  isSelected: boolean;
  toggleFileSelection: (fileId: string, fileType: "audio") => void;
}
export default function AudioFileCard({
  file,
  isSelected,
  toggleFileSelection,
}: AudioCardProps) {
  const { setAudioUrl, audioFileId, setAudioFileId, volume, setVolume } =
    useAudioPlayback();
  const [isLoading, setIsLoading] = useState(false);
  const { actions } = useVideoWorkflow();

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card selection

    try {
      if (audioFileId === file.id) {
        setAudioFileId(null);
        setAudioUrl(null);
      } else {
        setIsLoading(true);
        setAudioFileId(file.id);
        setAudioUrl(file.downloadUrl);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // duration from seconds to human readable format
  const fileDuration = file.metadata?.duration
    ? formatDuration(file.metadata.duration)
    : null;
  return (
    <div
      key={file.id}
      className={cn(
        "group border-2 rounded-lg p-4 cursor-pointer transition-all",
        {
          "border-zinc-900 bg-zinc-50": isSelected,
          "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50": !isSelected,
        }
      )}
      onClick={() => toggleFileSelection(file.id, "audio")}
    >
      <div className="flex items-center space-x-4">
        {/* Play Button */}
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause(e);
          }}
        >
          {audioFileId === file.id ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        {/* Audio Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            {
              "bg-zinc-900 text-white": isSelected,
              "bg-zinc-100 text-zinc-600": !isSelected,
            }
          )}
        >
          <Music className="w-5 h-5" />
        </div>

        {/* Audio Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-zinc-900 truncate">
              {file.originalName}
            </h4>
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-zinc-500">
              {/* {formatDuration(file.metadata?.duration || 0)} */}
            </span>
            <span className="text-sm text-zinc-500">
              {((file.metadata?.size || 0) / 1024 / 1024).toFixed(1)} MB
            </span>
            {fileDuration && (
              <span className="text-xs text-zinc-400 block">
                {fileDuration}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
