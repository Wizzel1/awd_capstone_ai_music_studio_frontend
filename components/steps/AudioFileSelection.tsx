"use client";

import AudioFileCard from "@/app/projects/[id]/create/AudioFileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AudioPlaybackProvider } from "@/lib/providers/AudioPlaybackProvider";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { FileService } from "@/lib/services/fileService";
import { Asset } from "@/lib/types/asset";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { Loader2, Music, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface AudioFileSelectionProps {
  project: Project;
}

export default function AudioFileSelection({
  project,
}: AudioFileSelectionProps) {
  const { state, actions } = useVideoWorkflow();
  const { selectedAudios } = state;
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Filter only audio assets
  const audioAssets = project.assets.filter(
    (asset) => asset.format === "audio"
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    FileService.uploadFiles(acceptedFiles, project.id).then(() => {
      setIsUploading(false);
      router.refresh();
    });
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
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative",
          {
            "border-zinc-900 bg-zinc-50": isDragActive,
            "border-zinc-300 hover:border-zinc-400":
              !isDragActive && !isUploading,
            "border-zinc-400 bg-zinc-100 cursor-not-allowed": isUploading,
          }
        )}
      >
        <input {...getInputProps()} disabled={isUploading} />

        {/* Upload Loading State */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center space-y-3">
              <Loader2 className="w-12 h-12 text-zinc-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-lg font-medium text-zinc-700">
                  Uploading audio files...
                </p>
                <p className="text-sm text-zinc-600">
                  Please wait while we process your files
                </p>
              </div>
            </div>
          </div>
        )}

        <Upload
          className={cn("w-12 h-12 mx-auto mb-4", {
            "text-zinc-400": !isUploading,
            "text-zinc-300": isUploading,
          })}
        />
        <div className="space-y-2">
          <p
            className={cn("text-lg font-medium", {
              "text-zinc-900": !isUploading,
              "text-zinc-400": isUploading,
            })}
          >
            {isDragActive
              ? "Drop audio files here"
              : "Drag & drop audio files here"}
          </p>
          <p
            className={cn("text-sm", {
              "text-zinc-500": !isUploading,
              "text-zinc-400": isUploading,
            })}
          >
            or{" "}
            <span
              className={cn("font-medium", {
                "text-zinc-900": !isUploading,
                "text-zinc-400": isUploading,
              })}
            >
              click to browse
            </span>
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

          <AudioPlaybackProvider>
            <div className="grid gap-3">
              {audioAssets.map((asset) => {
                return (
                  <AudioFileCard
                    key={asset.id}
                    file={asset}
                    isSelected={isSelected(asset.id)}
                    toggleFileSelection={(fileId, fileType) =>
                      handleAudioClick(asset)
                    }
                  />
                );
              })}
            </div>
          </AudioPlaybackProvider>
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
