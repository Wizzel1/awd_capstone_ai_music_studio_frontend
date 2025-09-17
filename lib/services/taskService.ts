import { getApiUrl } from "../env";
import { taskSchema } from "../types/task";

export class TaskService {
  static async createTask(
    projectId: string,
    audioIds: string[],
    imageIds: string[]
  ) {
    const response = await fetch(
      getApiUrl(`/projects/${projectId}/slideshow`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioIds, imageIds }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return { taskId: null, error: data.message };
    }

    return { taskId: data.id, error: null };
  }

  static async getTasksForUser() {
    const response = await fetch(getApiUrl(`/tasks`));
    const data = await response.json();
    return taskSchema.array().parse(data);
  }

  /**
   * Create an EventSource connection to receive task updates via SSE
   */
  static createTasksSSEConnection(): EventSource {
    return new EventSource(getApiUrl('/tasks/stream'), {
      withCredentials: true,
    });
  }
}
