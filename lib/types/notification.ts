import z from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  taskId: z.string(),
  message: z.string(),
  status: z.enum(["pending", "sent", "read"]),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sentAt: z.string().nullable(),
  readAt: z.string().nullable(),
});

export type Notification = z.infer<typeof notificationSchema>;
