import { getApiUrl } from "../env";
import { Project, projectSchema } from "../types/project";
export class ProjectsService {
  static async createProject(project: Omit<Project, "id" | "assets">) {
    return fetch(getApiUrl("/projects"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
  }

  static async getProjects(): Promise<Project[]> {
    const response = await fetch(getApiUrl("/projects"));
    return response.json();
  }

  static async getProject(id: string): Promise<Project> {
    const response = await fetch(getApiUrl(`/projects/${id}`));
    const data = await response.json();
    return projectSchema.parse(data);
  }

  static async deleteProject(id: string) {
    return fetch(getApiUrl(`/projects/${id}`), {
      method: "DELETE",
    });
  }
}
