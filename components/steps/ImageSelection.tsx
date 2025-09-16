"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { FileService } from "@/lib/services/fileService";
import { Asset } from "@/lib/types/asset";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageSelectionProps {
  project: Project;
}

export default function ImageSelection({ project }: ImageSelectionProps) {
  const { state, actions } = useVideoWorkflow();
  const { selectedImages } = state;

  const router = useRouter();

  // Filter only image assets
  const imageAssets = project.assets.filter(
    (asset) => asset.format === "image"
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    FileService.uploadFiles(acceptedFiles, project.id).then(router.refresh);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
  });

  const isSelected = (assetId: string) => {
    return selectedImages.some((img) => img.asset.id === assetId);
  };

  const getSelectionOrder = (assetId: string) => {
    const selection = selectedImages.find((img) => img.asset.id === assetId);
    return selection?.order;
  };

  const handleImageClick = (asset: Asset) => {
    if (isSelected(asset.id)) {
      actions.removeImage(asset.id);
    } else {
      actions.selectImage(asset);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Select Images</h2>
        <p className="text-zinc-600">
          Choose the images you want to include in your video. Click to select
          and order them.
        </p>
      </div>

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
            {isDragActive ? "Drop images here" : "Drag & drop images here"}
          </p>
          <p className="text-sm text-zinc-500">
            or{" "}
            <span className="text-zinc-900 font-medium">click to browse</span>
          </p>
          <p className="text-xs text-zinc-400">Supports: JPG, PNG, GIF, WebP</p>
        </div>
      </div>

      {/* Existing Images Grid */}
      {imageAssets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">
              Project Images ({imageAssets.length})
            </h3>
            {selectedImages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectedImages.forEach((img) =>
                    actions.removeImage(img.asset.id)
                  );
                }}
              >
                Clear Selection
              </Button>
            )}
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {imageAssets.map((asset, index) => {
              const selected = isSelected(asset.id);
              const order = getSelectionOrder(asset.id);

              return (
                <motion.div
                  key={asset.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleImageClick(asset)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Image Container */}
                  <div
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      {
                        "border-zinc-900 ring-2 ring-zinc-900 ring-offset-2":
                          selected,
                        "border-zinc-200 hover:border-zinc-300": !selected,
                      }
                    )}
                  >
                    <img
                      src={asset.downloadUrl}
                      alt={asset.originalName}
                      //   fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                    {/* Selection Overlay */}
                    {selected && (
                      <div className="absolute inset-0 bg-zinc-900/20 flex items-center justify-center">
                        <Badge
                          variant="secondary"
                          className="bg-zinc-900 text-white"
                        >
                          {order}
                        </Badge>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    {!selected && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-zinc-900" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Remove Button */}
                    {selected && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.removeImage(asset.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Image Name */}
                  <p
                    className="mt-2 text-xs text-zinc-600 truncate"
                    title={asset.originalName}
                  >
                    {asset.originalName}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* No Images State */}
      {imageAssets.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">
            No images in project
          </h3>
          <p className="text-zinc-500 mb-4">
            Upload images using the drag & drop area above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
