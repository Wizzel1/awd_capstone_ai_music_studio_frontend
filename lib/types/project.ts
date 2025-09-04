import { z } from "zod";

const metadataSchema = z.object({
  size: z.number(),
  duration: z.number().optional(),
  mimeType: z.string(),
});

export const assetSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  format: z.enum(["audio", "image"]),
  metadata: metadataSchema,
});

export type Asset = z.infer<typeof assetSchema>;

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  assets: z.array(assetSchema),
});

export type Project = z.infer<typeof projectSchema>;
