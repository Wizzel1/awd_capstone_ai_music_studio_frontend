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
    <div className="min-h-screen bg-zinc-50">
      <div className="px-6 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Project Overview</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Project Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {project.name}
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Audio Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-zinc-900 mb-4">Audio</h2>
              <div className="grid grid-cols-6 gap-3">
                {project.audioFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => toggleFileSelection(file.id)}
                    className={`
                      relative aspect-square rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedFiles.includes(file.id)
                          ? "border-zinc-900 bg-zinc-100"
                          : "border-zinc-200 hover:border-zinc-300 bg-white"
                      }
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-zinc-300 rounded mx-auto mb-1"></div>
                        <span className="text-xs text-zinc-600">
                          {file.name}
                        </span>
                      </div>
                    </div>
                    {selectedFiles.includes(file.id) && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-zinc-900 mb-4">Images</h2>
              <div className="grid grid-cols-6 gap-3">
                {project.imageFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => toggleFileSelection(file.id)}
                    className={`
                      relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden
                      ${
                        selectedFiles.includes(file.id)
                          ? "border-zinc-900"
                          : "border-zinc-200 hover:border-zinc-300"
                      }
                    `}
                  >
                    <img
                      src={file.thumbnail || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedFiles.includes(file.id) && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Upload placeholder */}
                <div className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-100 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-colors">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-zinc-400 rounded mx-auto mb-1"></div>
                    <span className="text-xs text-zinc-500">Upload new</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Render Button */}
            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 text-lg">
              Render Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
