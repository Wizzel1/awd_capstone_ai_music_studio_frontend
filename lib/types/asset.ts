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
  format: z.enum(["audio", "image", "video"]),
  metadata: metadataSchema.optional(),
});

export type Asset = z.infer<typeof assetSchema>;
