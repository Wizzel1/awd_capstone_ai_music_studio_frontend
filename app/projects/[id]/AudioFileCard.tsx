import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/lib/providers/AudioPlaybackProvider";
import { Asset } from "@/lib/types/asset";
import { cn } from "@/lib/utils";
import { Music, Pause, Play, Volume2, X } from "lucide-react";
import { useState } from "react";

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
            handlePlayPause(file.id);
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
              {(file.metadata?.size || 0 / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
        </div>

        {/* Waveform Placeholder */}
        <div className="hidden md:flex items-center space-x-1 w-24">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cn("w-1 bg-zinc-300 rounded-full transition-all", {
                "bg-zinc-900": isSelected,
                "h-3": i % 3 === 0,
                "h-5": i % 3 === 1,
                "h-4": i % 3 === 2,
              })}
            />
          ))}
        </div>

        {/* Volume Icon */}
        <Volume2 className="w-4 h-4 text-zinc-400" />

        {/* Remove Button */}
        {isSelected && (
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white border-0"
            onClick={(e) => {
              e.stopPropagation();
              // actions.removeAudio(file.id);
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Audio Waveform/Progress (when playing) */}
      {audioFileId === file.id && (
        <div className="mt-3 pt-3 border-t border-zinc-200">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500">0:00</span>
            <div className="flex-1 h-1 bg-zinc-200 rounded-full">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                style={{ width: "25%" }}
              />
            </div>
            <span className="text-xs text-zinc-500">
              {/* {formatDuration(file.metadata?.duration || 0)} */}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
