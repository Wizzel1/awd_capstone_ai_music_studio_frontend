import { Project, projectSchema } from "../types/project";
export class ProjectsService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

  static async createProject(project: Omit<Project, "id" | "assets">) {
    return fetch(`${this.baseUrl}/api/v1/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
  }

  static async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/projects`);
    return response.json();
  }

  static async getProject(id: string): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/api/v1/projects/${id}`);
    const data = await response.json();
    return projectSchema.parse(data);
  }

  static async deleteProject(id: string) {
    return fetch(`${this.baseUrl}/api/v1/projects/${id}`, {
      method: "DELETE",
    });
  }
}
