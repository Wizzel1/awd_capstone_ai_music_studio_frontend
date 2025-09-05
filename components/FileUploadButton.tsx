import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { Loader2, Plus } from "lucide-react";
import { useRef } from "react";

interface FileUploadButtonProps {
  onUploadSuccess?: (results: any[]) => void;
  projectId: string;
  allowedTypes?: string[];
  multiple?: boolean;
}

export function FileUploadButton({
  onUploadSuccess,
  projectId,
  allowedTypes = ["image/*", "audio/*"],
  multiple = true,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadFromInput } = useFileUpload(
    {
      allowedTypes,
      onSuccess: onUploadSuccess,
    },
    projectId
  );

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
            Upload Files
          </>
        )}
      </Button>
    </>
  );
}
