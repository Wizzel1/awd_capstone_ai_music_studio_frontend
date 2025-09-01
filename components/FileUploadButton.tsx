import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { Loader2, Plus } from "lucide-react";
import { useRef } from "react";

interface FileUploadButtonProps {
  onUploadSuccess?: (results: any[]) => void;
  bucketName?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  children?: React.ReactNode;
}

export function FileUploadButton({
  onUploadSuccess,
  bucketName = "test",
  allowedTypes = ["image/*", "audio/*"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  children,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadFromInput } = useFileUpload({
    bucketName,
    allowedTypes,
    maxFileSize,
    onSuccess: onUploadSuccess,
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(",")}
        onChange={uploadFromInput}
        className="hidden"
      />
      <Button onClick={handleClick} disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Plus />
            {children || "Upload Files"}
          </>
        )}
      </Button>
    </>
  );
}
