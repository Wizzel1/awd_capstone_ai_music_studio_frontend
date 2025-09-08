import { z } from "zod";

export const taskSchema = z.object({
  id: z.uuid(),
  error: z.string().nullable(),
  status: z.enum(["running", "error"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
