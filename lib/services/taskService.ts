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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    console.log(data);
    return data;
  }

  static async getTasksForUser() {
    const response = await fetch(getApiUrl(`/tasks`));
    const data = await response.json();
    return taskSchema.array().parse(data);
  }
}
