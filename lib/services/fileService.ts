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
  static async uploadFile(
    file: File,
    projectId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const { allowedTypes = ["image/*", "audio/*"] } = options;

    // Client-side validation
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File ${file.name} is too large. Maximum size is ${Math.round(
          MAX_FILE_SIZE / (1024 * 1024)
        )}MB.`
      );
    }

    // Check file type
    const isAllowedType = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const category = type.split("/")[0];
        return file.type.startsWith(category + "/");
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      throw new Error(
        `File type ${
          file.type
        } is not allowed. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    const formData = new FormData();
    formData.append("file", file);
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

  static async uploadFiles(
    files: File[],
    projectId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    // Upload files concurrently for better performance
    const uploadPromises = Array.from(files).map((file) =>
      this.uploadFile(file, projectId, options)
    );

    return Promise.all(uploadPromises);
  }

  // Helper method for drag & drop scenarios
  static async uploadFromDataTransfer(
    dataTransfer: DataTransfer,
    projectId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const files = Array.from(dataTransfer.files);
    return this.uploadFiles(files, projectId, options);
  }
}
