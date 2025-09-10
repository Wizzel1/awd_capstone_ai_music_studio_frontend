import { Asset } from "@/lib/types/asset";

export default function VideoFileCard({ file }: { file: Asset }) {
  return (
    <div className="relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden border-zinc-200 hover:border-zinc-300 hover:shadow-sm">
      <video
        src={"https://www.pexels.com/download/video/6769800/"}
        controls
        className="w-full h-full object-cover"
      />
    </div>
  );
}
