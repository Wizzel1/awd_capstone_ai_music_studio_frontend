//TODO: Add proper type

import { Asset } from "@/lib/types/project";
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
        {/* Play button */}
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="absolute top-2 left-2 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all z-10 disabled:opacity-50"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            // Pause icon
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Play icon
            <svg
              className="w-3 h-3 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className="text-center">
            <div className="w-8 h-8 bg-zinc-300 rounded mx-auto mb-2 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-zinc-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
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
