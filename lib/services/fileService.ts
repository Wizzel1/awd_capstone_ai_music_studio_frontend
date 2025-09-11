import { getApiUrl } from "../env";
//TODO: Use zod to validate the response and move types to a separate file
export interface UploadResult {
  message: string;
  filename: string;
  originalName: string;
  bucket: string;
  size: number;
  mimetype: string;
}
export interface UploadOptions {
  allowedTypes?: string[];
}

const MAX_FILE_SIZE = 20000000;

export class FileService {
  static async uploadFiles(
    files: FileList,
    projectId: string
  ): Promise<UploadResult> {
    const filteredFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) return false;
      return true;
    });

    const formData = new FormData();
    filteredFiles.forEach((file) => {
      formData.append("files", file);
    });
    const response = await fetch(getApiUrl(`/assets/${projectId}`), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response isn't JSON, use default message
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Helper method for drag & drop scenarios
  static async uploadFromDataTransfer(
    dataTransfer: DataTransfer,
    projectId: string
  ) {
    return this.uploadFiles(dataTransfer.files, projectId);
  }
}
