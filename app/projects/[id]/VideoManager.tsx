"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types/project";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";
import VideoFileCard from "./VideoFileCard";

interface VideoManagerProps {
  project: Project;
}

export default function VideoManager({ project }: VideoManagerProps) {
  const router = useRouter();
  const videoAssets = project.assets
    .filter((asset) => asset.format === "video")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleGenerateNewProject = () => {
    router.push(`/projects/${project.id}/create`);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{project.name}</h1>
          <p className="text-sm text-zinc-600 mt-1">
            View your project's video assets
          </p>
        </div>
        {videoAssets.length > 0 && (
          <Button
            onClick={handleGenerateNewProject}
            className="w-full sm:w-auto"
          >
            Create New Video
          </Button>
        )}
      </div>

      {/* Video Section */}
      <div className="flex flex-col gap-6">
        {videoAssets.length > 0 ? (
          videoAssets.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <VideoFileCard file={file} projectId={project.id} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-48"
          >
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-800 mb-2">
                No videos yet
              </h3>
              <p className="text-zinc-600 mb-4">
                Start creating your first video.
              </p>
              <Button onClick={handleGenerateNewProject} variant="outline">
                Create Video
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
