"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { Asset } from "@/lib/types/asset";
import { cn } from "@/lib/utils";
import { Music, Pause, Play, Upload, Volume2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface AudioFileSelectionProps {
  project: {
    assets: Asset[];
  };
}

export default function AudioFileSelection({
  project,
}: AudioFileSelectionProps) {
  const { state, actions } = useVideoWorkflow();
  const { selectedAudios } = state;
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Filter only audio assets
  const audioAssets = project.assets.filter(
    (asset) => asset.format === "audio"
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Audio files dropped:", acceptedFiles);
    // TODO: Handle file upload in Phase 4
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".aac", ".ogg"],
    },
    multiple: true,
  });

  const isSelected = (assetId: string) => {
    return selectedAudios.some((audio) => audio.asset.id === assetId);
  };

  const getSelectionOrder = (assetId: string) => {
    const selection = selectedAudios.find(
      (audio) => audio.asset.id === assetId
    );
    return selection?.order;
  };

  const handleAudioClick = (asset: Asset) => {
    if (isSelected(asset.id)) {
      actions.removeAudio(asset.id);
    } else {
      actions.selectAudio(asset);
    }
  };

  const handlePlayPause = (assetId: string) => {
    if (playingId === assetId) {
      setPlayingId(null);
    } else {
      setPlayingId(assetId);
    }
    // TODO: Implement actual audio playback
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          {
            "border-zinc-900 bg-zinc-50": isDragActive,
            "border-zinc-300 hover:border-zinc-400": !isDragActive,
          }
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-zinc-900">
            {isDragActive
              ? "Drop audio files here"
              : "Drag & drop audio files here"}
          </p>
          <p className="text-sm text-zinc-500">
            or{" "}
            <span className="text-zinc-900 font-medium">click to browse</span>
          </p>
          <p className="text-xs text-zinc-400">
            Supports: MP3, WAV, M4A, AAC, OGG
          </p>
        </div>
      </div>

      {/* Existing Audio Files */}
      {audioAssets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">
              Project Audio ({audioAssets.length})
            </h3>
            {selectedAudios.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectedAudios.forEach((audio) =>
                    actions.removeAudio(audio.asset.id)
                  );
                }}
              >
                Clear Selection
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {audioAssets.map((asset) => {
              const selected = isSelected(asset.id);
              const order = getSelectionOrder(asset.id);
              const isPlaying = playingId === asset.id;
              const duration = asset.metadata?.duration || 0;

              return (
                <div
                  key={asset.id}
                  className={cn(
                    "group border-2 rounded-lg p-4 cursor-pointer transition-all",
                    {
                      "border-zinc-900 bg-zinc-50": selected,
                      "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50":
                        !selected,
                    }
                  )}
                  onClick={() => handleAudioClick(asset)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Play Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(asset.id);
                      }}
                    >
                      {isPlaying ? (
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
                          "bg-zinc-900 text-white": selected,
                          "bg-zinc-100 text-zinc-600": !selected,
                        }
                      )}
                    >
                      <Music className="w-5 h-5" />
                    </div>

                    {/* Audio Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-zinc-900 truncate">
                          {asset.originalName}
                        </h4>
                        {selected && (
                          <Badge
                            variant="secondary"
                            className="bg-zinc-900 text-white"
                          >
                            {order}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-zinc-500">
                          {formatDuration(duration)}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {(asset.metadata?.size || 0 / 1024 / 1024).toFixed(1)}{" "}
                          MB
                        </span>
                      </div>
                    </div>

                    {/* Waveform Placeholder */}
                    <div className="hidden md:flex items-center space-x-1 w-24">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 bg-zinc-300 rounded-full transition-all",
                            {
                              "bg-zinc-900": selected,
                              "h-3": i % 3 === 0,
                              "h-5": i % 3 === 1,
                              "h-4": i % 3 === 2,
                            }
                          )}
                        />
                      ))}
                    </div>

                    {/* Volume Icon */}
                    <Volume2 className="w-4 h-4 text-zinc-400" />

                    {/* Remove Button */}
                    {selected && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.removeAudio(asset.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Audio Waveform/Progress (when playing) */}
                  {isPlaying && (
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
                          {formatDuration(duration)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Audio State */}
      {audioAssets.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">
            No audio files in project
          </h3>
          <p className="text-zinc-500 mb-4">
            Upload audio files using the drag & drop area above to get started.
          </p>
        </div>
      )}

      {/* Selection Summary */}
      {selectedAudios.length > 0 && (
        <div className="bg-zinc-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-zinc-900">
                {selectedAudios.length} audio file
                {selectedAudios.length !== 1 ? "s" : ""} selected
              </h4>
              <p className="text-sm text-zinc-600">
                Audio will play in sequence in the order selected
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary">
                {selectedAudios.length}/{audioAssets.length}
              </Badge>
              <p className="text-xs text-zinc-500 mt-1">
                Total:{" "}
                {selectedAudios.reduce(
                  (acc, audio) => acc + (audio.asset.metadata?.duration || 0),
                  0
                )}
                s
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
