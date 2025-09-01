"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";

interface MediaFile {
  id: string;
  name: string;
  type: "audio" | "image";
  thumbnail?: string;
}

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: projectId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Mock project data - in real app this would come from API/database
  const project = {
    id: projectId,
    name: projectId === "1" ? "Marriage Video" : `Project ${projectId}`,
    progress: 10,
    audioFiles: [
      { id: "a1", name: "Audio.wav", type: "audio" as const },
      { id: "a2", name: "Audio.wav", type: "audio" as const },
      { id: "a3", name: "Audio.wav", type: "audio" as const },
      { id: "a4", name: "Audio.wav", type: "audio" as const },
      { id: "a5", name: "Audio.wav", type: "audio" as const },
      { id: "a6", name: "Audio.wav", type: "audio" as const },
    ],
    imageFiles: [
      {
        id: "i1",
        name: "sunflower1.jpg",
        type: "image" as const,
        thumbnail: "/single-sunflower.png",
      },
      {
        id: "i2",
        name: "sunflower2.jpg",
        type: "image" as const,
        thumbnail: "/single-sunflower.png",
      },
      {
        id: "i3",
        name: "sunflower3.jpg",
        type: "image" as const,
        thumbnail: "/single-sunflower.png",
      },
      {
        id: "i4",
        name: "sunflower4.jpg",
        type: "image" as const,
        thumbnail: "/single-sunflower.png",
      },
      {
        id: "i5",
        name: "sunflower5.jpg",
        type: "image" as const,
        thumbnail: "/single-sunflower.png",
      },
      {
        id: "i6",
        name: "sunflower6.jpg",
        type: "image" as const,
        thumbnail: "/single-sunflower.png",
      },
    ],
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{project.name}</h1>
          <p className="text-zinc-600 mt-1">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file${
                  selectedFiles.length !== 1 ? "s" : ""
                } selected`
              : "Select files to include in your video"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedFiles.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {project.audioFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => toggleFileSelection(file.id)}
                  className={`
                      relative aspect-square rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedFiles.includes(file.id)
                          ? "border-zinc-900 bg-zinc-100 shadow-md"
                          : "border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-sm"
                      }
                    `}
                >
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
                        {file.name}
                      </span>
                    </div>
                  </div>
                  {selectedFiles.includes(file.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Image Files
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {project.imageFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => toggleFileSelection(file.id)}
                  className={`
                      relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden
                      ${
                        selectedFiles.includes(file.id)
                          ? "border-zinc-900 shadow-md"
                          : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                      }
                    `}
                >
                  <img
                    src={file.thumbnail || "/placeholder.svg"}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all"></div>
                  {selectedFiles.includes(file.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {/* Upload placeholder */}
              <div className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-100 transition-all">
                <div className="text-center">
                  <div className="w-8 h-8 bg-zinc-400 rounded mx-auto mb-2 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">
                    Upload new
                  </span>
                </div>
              </div>
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
                <span className="font-medium">
                  {
                    project.audioFiles.filter((f) =>
                      selectedFiles.includes(f.id)
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Image files:</span>
                <span className="font-medium">
                  {
                    project.imageFiles.filter((f) =>
                      selectedFiles.includes(f.id)
                    ).length
                  }
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm font-medium">
                <span>Total selected:</span>
                <span>{selectedFiles.length}</span>
              </div>
            </div>
          </div>

          {/* Render Button */}
          <Button
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 text-lg font-semibold"
            disabled={selectedFiles.length === 0}
          >
            {selectedFiles.length === 0
              ? "Select Files to Render"
              : "Render Video"}
          </Button>
        </div>
      </div>
    </div>
  );
}
