"use client";

import { Project } from "@/lib/types/project";
import { useRouter } from "next/navigation";
import VideoFileCard from "./VideoFileCard";

interface VideoManagerProps {
  project: Project;
}

export default function VideoManager({ project }: VideoManagerProps) {
  const router = useRouter();
  const videoAssets = project.assets.filter(
    (asset) => asset.format === "video"
  );

  return (
    <>
      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Video Section */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">
            Video Files
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {videoAssets?.map((file) => (
              <VideoFileCard key={file.id} file={file} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
