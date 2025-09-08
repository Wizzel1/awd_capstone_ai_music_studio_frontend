import { z } from "zod";
import { taskSchema } from "./task";

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
  format: z.enum(["audio", "image"]),
  metadata: metadataSchema.optional(),
});

export type Asset = z.infer<typeof assetSchema>;

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  assets: z.array(assetSchema),
  tasks: z.array(taskSchema).optional(),
});

export type Project = z.infer<typeof projectSchema>;
