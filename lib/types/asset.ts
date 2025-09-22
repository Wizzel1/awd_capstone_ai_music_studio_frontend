import { z } from "zod";

const metadataSchema = z.object({
  size: z.number(),
  duration: z.number().optional(),
});

export const assetSchema = z.object({
  id: z.uuid(),
  originalName: z.string(),
  storageName: z.string(),
  downloadUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  format: z.enum(["audio", "image", "video", "ai_audio"]),
  metadata: metadataSchema.optional(),
});


export function formatDuration(e: number) {
  const m = Math.floor(e % 3600 / 60).toString().padStart(2, '0');
  const s = Math.floor(e % 60).toString().padStart(2, '0');

  return m + ':' + s;
}
export type Asset = z.infer<typeof assetSchema>;
