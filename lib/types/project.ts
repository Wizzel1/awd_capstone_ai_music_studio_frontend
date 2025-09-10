import { z } from "zod";
import { assetSchema } from "./asset";
import { taskSchema } from "./task";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  assets: z.array(assetSchema),
  tasks: z.array(taskSchema).optional(),
});

export type Project = z.infer<typeof projectSchema>;
