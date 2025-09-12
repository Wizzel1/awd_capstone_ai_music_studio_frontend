import z from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  taskId: z.string(),
  message: z.string(),
  status: z.enum(["pending", "sent", "read"]),
  isDeleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  sentAt: z.string().nullish(),
  readAt: z.string().nullish(),
});

export type Notification = z.infer<typeof notificationSchema>;
