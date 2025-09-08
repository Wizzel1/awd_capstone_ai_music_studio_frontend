"use client";

import { FileUploadButton } from "@/components/FileUploadButton";
import { Button } from "@/components/ui/button";
import { AudioPlaybackProvider } from "@/lib/providers/AudioPlaybackProvider";
import { TaskService } from "@/lib/services/taskService";
import { Project } from "@/lib/types/project";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { group } from "radashi";
import { useState } from "react";
import { toast } from "sonner";
import AudioFileCard from "./AudioFileCard";
import ImageFileCard from "./ImageFileCard";
import TaskFileCard from "./TaskFileCard";
interface FileManagerProps {
  project: Project;
}

export default function FileManager({ project }: FileManagerProps) {
  const router = useRouter();
  const [selectedAudioFiles, setSelectedAudioFiles] = useState<
    { id: string; order: number }[]
  >([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<
    { id: string; order: number }[]
  >([]);

  const { audio: audioFiles, image: imageFiles } = group(
    project.assets,
    (asset) => asset.format
  );

  const toggleFileSelection = (fileId: string, fileType: "audio" | "image") => {
    const setSelectedFiles =
      fileType === "audio" ? setSelectedAudioFiles : setSelectedImageFiles;

    setSelectedFiles((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === fileId);
      if (existingIndex !== -1) {
        // Remove the file and adjust order numbers
        const newSelection = prev.filter((item) => item.id !== fileId);
        return newSelection.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      } else {
        // Add the file with the next order number
        return [...prev, { id: fileId, order: prev.length + 1 }];
      }
    });
  };

  const createTask = async () => {
    await TaskService.createTask(
      project.id,
      selectedAudioFiles.map((file) => file.id),
      selectedImageFiles.map((file) => file.id)
    );
    router.refresh();
  };

  return (
    <>
      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2  ">
            <Link href="/">
              <ChevronLeft className="size-6" />
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900">{project.name}</h1>
          </div>
          <p className="text-zinc-600 mt-1">
            {selectedAudioFiles.length + selectedImageFiles.length > 0
              ? `${selectedAudioFiles.length + selectedImageFiles.length} file${
                  selectedAudioFiles.length + selectedImageFiles.length !== 1
                    ? "s"
                    : ""
                } selected`
              : "Select files to include in your video"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FileUploadButton
            multiple={false}
            projectId={project.id}
            onUploadSuccess={() => {
              toast.success("Files uploaded successfully");
              // Refresh the page to show newly uploaded files
              router.refresh();
            }}
          />
          {(selectedAudioFiles.length > 0 || selectedImageFiles.length > 0) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAudioFiles([]);
                setSelectedImageFiles([]);
              }}
              className="text-zinc-600"
            >
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-8">
          {/* Audio Section */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Audio Files
            </h2>
            <AudioPlaybackProvider>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {audioFiles?.map((file) => (
                  <AudioFileCard
                    key={file.id}
                    file={file}
                    selectedAudioFiles={selectedAudioFiles}
                    toggleFileSelection={toggleFileSelection}
                  />
                ))}
              </div>
            </AudioPlaybackProvider>
          </div>
          {/* Images Section */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Image Files
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {imageFiles?.map((file) => (
                <ImageFileCard
                  key={file.id}
                  file={file}
                  selectedImageFiles={selectedImageFiles}
                  toggleFileSelection={toggleFileSelection}
                />
              ))}
            </div>
          </div>
          {/* Tasks Section */}{" "}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Tasks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {project.tasks?.map((task) => (
                <TaskFileCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Selection Summary */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">
              Selection Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Audio files:</span>
                <span className="font-medium">{selectedAudioFiles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Image files:</span>
                <span className="font-medium">{selectedImageFiles.length}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm font-medium">
                <span>Total selected:</span>
                <span>
                  {selectedAudioFiles.length + selectedImageFiles.length}
                </span>
              </div>
            </div>
          </div>

          {/* Render Button */}
          <Button
            onClick={createTask}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 text-lg font-semibold"
            disabled={
              selectedAudioFiles.length + selectedImageFiles.length === 0
            }
          >
            {selectedAudioFiles.length + selectedImageFiles.length === 0
              ? "Select Files to Render"
              : "Render Video"}
          </Button>
        </div>
      </div>
    </>
  );
}
