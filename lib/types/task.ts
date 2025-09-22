import { z } from "zod";

export const taskSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  error: z.string().nullable(),
  result: z.record(z.string(), z.string()).nullable(),
  status: z.enum(["running", "error", "finished"]),
  params: z.object({
    audioKeys: z.array(z.string()),
    imageKeys: z.array(z.string()),
  }).nullable()
  ,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
