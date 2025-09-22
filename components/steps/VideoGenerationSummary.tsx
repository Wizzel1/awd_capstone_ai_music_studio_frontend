"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUserTasks } from "@/lib/providers/UserTaskProvider";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { TaskService } from "@/lib/services/taskService";
import { Project } from "@/lib/types/project";
import { AudioMethod } from "@/lib/types/workflow";
import confetti from "canvas-confetti";
import { Image, Music, Play, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const videoResolutions = [
  { value: "720p", label: "720p HD", description: "1280 × 720", size: "~50MB" },
  {
    value: "1080p",
    label: "1080p Full HD",
    description: "1920 × 1080",
    size: "~100MB",
  },
  {
    value: "4k",
    label: "4K Ultra HD",
    description: "3840 × 2160",
    size: "~400MB",
  },
];

const frameRates = [
  { value: "24", label: "24 FPS", description: "Cinematic" },
  { value: "30", label: "30 FPS", description: "Standard" },
  { value: "60", label: "60 FPS", description: "Smooth" },
];

export default function VideoGenerationSummary({
  project,
}: {
  project: Project;
}) {
  const { state } = useVideoWorkflow();
  const { selectedImages, audioMethod, selectedAudios, lyrics } = state;

  const [resolution, setResolution] = useState("1080p");
  const [frameRate, setFrameRate] = useState("30");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const router = useRouter();
  const { getTasksForProject } = useUserTasks();
  const tasks = getTasksForProject(project.id);
  const videoTask = tasks.find((task) => task.id === taskId);
  const isGenerating = videoTask?.status === "running";
  const generationComplete = videoTask?.status === "finished";
  const generationFailed = videoTask?.status === "error";

  useEffect(() => {
    if (generationComplete) router.refresh();
  }, [generationComplete]);

  // Trigger confetti animation when video generation completes
  useEffect(() => {
    if (generationComplete) {
      const triggerConfetti = () => {
        const end = Date.now() + 2 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
          if (Date.now() > end) return;

          confetti({
            particleCount: 1,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: colors,
          });
          confetti({
            particleCount: 1,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: colors,
          });

          requestAnimationFrame(frame);
        };

        frame();
      };

      // Small delay to ensure the success view is rendered first
      setTimeout(triggerConfetti, 100);
    }
  }, [generationComplete]);

  const videoAsset = project.assets.find((asset) => {
    const name = videoTask?.result?.["videoKey"].split("/")[2];
    return asset.originalName === name;
  });

  const handleGenerate = async () => {
    setGenerationProgress(0);

    const audioIds = selectedAudios.map((audio) => audio.asset.id);
    const imageIds = selectedImages.map((image) => image.asset.id);

    TaskService.createTask(project.id, audioIds, imageIds).then((data) => {
      setTaskId(data.taskId);
    });
  };

  const getEstimatedDuration = () => {
    if (audioMethod === AudioMethod.AI_GENERATION) {
      return "2:34"; // Mock duration for generated audio
    }
    if (audioMethod === AudioMethod.FILE_UPLOAD && selectedAudios.length > 0) {
      const totalDuration = selectedAudios.reduce(
        (acc, audio) => acc + (audio.asset.metadata?.duration || 0),
        0
      );
      const mins = Math.floor(totalDuration / 60);
      const secs = totalDuration % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return "Unknown";
  };

  const getEstimatedSize = () => {
    const baseSize =
      resolution === "4k" ? 400 : resolution === "1080p" ? 100 : 50;
    return `~${baseSize}MB`;
  };

  if (generationComplete) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Video Generated Successfully!
          </h2>
          <p className="text-zinc-600">Your video is ready for download</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-full h-84 bg-zinc-100 rounded-lg flex items-center justify-center">
                <video
                  className="w-full h-full object-cover rounded-lg"
                  src={videoAsset?.downloadUrl}
                  controls
                />
              </div>
              {/* <div>
                <h3 className="font-semibold text-zinc-900">Generated Video</h3>
                <p className="text-sm text-zinc-600">
                  {resolution} • {frameRate} FPS • {getEstimatedDuration()}
                </p>
              </div> */}
              {/* <div className="flex space-x-3">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (generationFailed) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Video Generation Failed 😥
          </h2>
          <p className="text-zinc-600">Please try again or contact support</p>
          <Button onClick={handleGenerate}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Generating Your Video
          </h2>
          <p className="text-zinc-600">
            Please wait while we create your video
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-zinc-600 animate-spin" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Processing...
                </h3>
                <p className="text-sm text-zinc-600">
                  Combining {selectedImages.length} images with audio
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Progress</span>
                  <span className="text-zinc-900 font-medium">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>

              <div className="text-center text-xs text-zinc-500">
                Estimated time remaining:{" "}
                {Math.max(1, Math.round((100 - generationProgress) / 20))}{" "}
                minutes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Content Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Image className="w-5 h-5" />
                Images ({selectedImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {selectedImages.slice(0, 12).map((selection, index) => (
                  <div key={selection.id} className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={selection.asset.downloadUrl}
                        alt={selection.asset.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 text-xs bg-zinc-900 text-white"
                    >
                      {selection.order}
                    </Badge>
                  </div>
                ))}
                {selectedImages.length > 12 && (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 flex items-center justify-center">
                    <span className="text-xs text-zinc-500">
                      +{selectedImages.length - 12}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Audio Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {audioMethod === AudioMethod.AI_GENERATION ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <Music className="w-5 h-5" />
                )}
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {audioMethod === AudioMethod.AI_GENERATION ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">
                      Generated Audio
                    </span>
                    <Badge variant="outline">AI Generated</Badge>
                  </div>
                  <div className="p-3 h-38 bg-zinc-50 rounded-lg">
                    <p className="text-sm text-zinc-700">
                      {lyrics || "No lyrics provided"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Duration:</span>
                    <span className="text-zinc-900">
                      {getEstimatedDuration()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedAudios.map((selection) => (
                    <div
                      key={selection.id}
                      className="flex items-center justify-between p-2 bg-zinc-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="w-6 h-6 rounded-full p-0 text-xs"
                        >
                          {selection.order}
                        </Badge>
                        <span className="text-sm text-zinc-900 truncate">
                          {selection.asset.originalName}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {Math.floor(
                          (selection.asset.metadata?.duration || 0) / 60
                        )}
                        :
                        {((selection.asset.metadata?.duration || 0) % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings & Generation */}
        <div className="space-y-6">
          {/* Video Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Video Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">
                  Resolution
                </label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoResolutions.map((res) => (
                      <SelectItem key={res.value} value={res.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{res.label}</span>
                          <span className="text-xs text-zinc-500">
                            {res.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">
                  Frame Rate
                </label>
                <Select value={frameRate} onValueChange={setFrameRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frameRates.map((rate) => (
                      <SelectItem key={rate.value} value={rate.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{rate.label}</span>
                          <span className="text-xs text-zinc-500">
                            {rate.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Estimated duration:</span>
                  <span className="text-zinc-900">
                    {getEstimatedDuration()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Estimated size:</span>
                  <span className="text-zinc-900">{getEstimatedSize()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ready to Generate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-zinc-600 mb-4">
                  Your video will be created with {selectedImages.length} images
                  and {selectedAudios.length} audio.
                </p>
                <Button onClick={handleGenerate} className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Generate Video
                </Button>
              </div>

              <div className="text-xs text-zinc-500 text-center">
                Generation typically takes 2-5 minutes
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
