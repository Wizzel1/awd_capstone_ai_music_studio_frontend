import { Asset } from "@/lib/types/project";
import { Disc3, Play } from "lucide-react";
import { useRef, useState } from "react";

interface AudioCardProps {
  file: Asset;
  selectedAudioFiles: { id: string; order: number }[];
  toggleFileSelection: (fileId: string, fileType: "audio") => void;
}
export default function AudioFileCard({
  file,
  selectedAudioFiles,
  toggleFileSelection,
}: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card selection

    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    console.error("Error loading audio file");
  };
  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={file.downloadUrl}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      <div
        key={file.id}
        onClick={() => toggleFileSelection(file.id, "audio")}
        className={`
                  relative aspect-square rounded-lg border-2 cursor-pointer transition-all
                  ${
                    selectedAudioFiles.some((item) => item.id === file.id)
                      ? "border-zinc-900 bg-zinc-100 shadow-md"
                      : "border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-sm"
                  }
                  
                `}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className="text-center">
            {/* Play button */}
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="w-10 h-10 bg-zinc-300 hover:bg-zinc-400 rounded-md mx-auto mb-2 flex items-center justify-center transition-all disabled:opacity-50"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-zinc-600 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Disc3 className="w-4 h-4 text-zinc-600 animate-spin" />
              ) : (
                <Play className="w-4 h-4 text-zinc-600" />
              )}
            </button>
            <span className="text-xs text-zinc-600 break-all">
              {file.originalName}
            </span>
          </div>
        </div>
        {(() => {
          const selectedItem = selectedAudioFiles.find(
            (item) => item.id === file.id
          );
          return (
            selectedItem && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {selectedItem.order}
                </span>
              </div>
            )
          );
        })()}
      </div>
    </>
  );
}
