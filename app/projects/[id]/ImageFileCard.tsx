//TODO: Add proper type
interface ImageFileCardProps {
  file: any;
  selectedImageFiles: any[];
  toggleFileSelection: (fileId: string, fileType: "image") => void;
}

export default function ImageFileCard({
  file,
  selectedImageFiles,
  toggleFileSelection,
}: ImageFileCardProps) {
  return (
    <div
      key={file.id}
      onClick={() => toggleFileSelection(file.id, "image")}
      className={`
                  relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden
                  ${
                    selectedImageFiles.some((item) => item.id === file.id)
                      ? "border-zinc-900 shadow-md"
                      : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                  }
                `}
    >
      <img
        src={"https://placehold.co/200x200"}
        alt={file.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-10 transition-all"></div>
      {(() => {
        const selectedItem = selectedImageFiles.find(
          (item) => item.id === file.id
        );
        return (
          selectedItem && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {selectedItem.order}
              </span>
            </div>
          )
        );
      })()}
    </div>
  );
}
