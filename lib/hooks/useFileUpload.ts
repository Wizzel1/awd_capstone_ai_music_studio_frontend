import { FileService, UploadResult } from "@/lib/services/fileService";
import { useCallback, useState } from "react";

interface UploadHookOptions {
  allowedTypes?: string[];
  onSuccess?: (results: UploadResult[]) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(
  options: UploadHookOptions = {},
  projectId: string
) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setUploadError(null);

      try {
        const results = await FileService.uploadFiles(
          files,
          projectId as string,
          {
            allowedTypes: options.allowedTypes || ["image/*", "audio/*"],
          }
        );

        options.onSuccess?.(results);
        return results;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadError(errorMessage);
        options.onError?.(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const uploadFromInput = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        await uploadFiles(Array.from(files));
        // Reset input value so same file can be selected again
        event.target.value = "";
      }
    },
    [uploadFiles]
  );

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    isUploading,
    uploadError,
    uploadFromInput,
    clearError,
  };
}
