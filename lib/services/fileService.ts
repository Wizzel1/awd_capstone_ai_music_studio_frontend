interface UploadResult {
  message: string;
  filename: string;
  originalName: string;
  bucket: string;
  size: number;
  mimetype: string;
}

interface UploadOptions {
  bucketName?: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
}

export class FileService {
  private static baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  static async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      bucketName = "test",
      maxFileSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ["image/*", "audio/*"],
    } = options;

    // Client-side validation
    if (file.size > maxFileSize) {
      throw new Error(
        `File ${file.name} is too large. Maximum size is ${Math.round(
          maxFileSize / (1024 * 1024)
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

    const response = await fetch(
      `${this.baseUrl}/api/v1/storage/upload/${bucketName}`,
      {
        method: "POST",
        body: formData,
      }
    );

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
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    // Upload files concurrently for better performance
    const uploadPromises = Array.from(files).map((file) =>
      this.uploadFile(file, options)
    );

    return Promise.all(uploadPromises);
  }

  // Helper method for drag & drop scenarios
  static async uploadFromDataTransfer(
    dataTransfer: DataTransfer,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const files = Array.from(dataTransfer.files);
    return this.uploadFiles(files, options);
  }
}
