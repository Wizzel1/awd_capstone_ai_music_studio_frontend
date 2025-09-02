interface AudioCardProps {
  file: any;
  selectedAudioFiles: any[];
  toggleFileSelection: (fileId: string, fileType: "audio") => void;
}
export default function AudioFileCard({
  file,
  selectedAudioFiles,
  toggleFileSelection,
}: AudioCardProps) {
  return (
    <>
      <div
        key={file.id}
        onClick={() => toggleFileSelection(file.id, "audio")}
        className={`
                  relative aspect-square rounded-lg border-2 cursor-pointer transition-all
                  ${
                    selectedAudioFiles.some((item) => item.id === file.id)
                      ? "border-zinc-900 bg-zinc-100 shadow-md"
                      : "border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-sm"
                  }
                `}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className="text-center">
            <div className="w-8 h-8 bg-zinc-300 rounded mx-auto mb-2 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-zinc-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xs text-zinc-600 break-all">{file.name}</span>
          </div>
        </div>
        {(() => {
          const selectedItem = selectedAudioFiles.find(
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
    </>
  );
}
