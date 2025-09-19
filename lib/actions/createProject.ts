"use server";

import { ProjectsService } from "@/lib/services/projectsService";
import { revalidatePath } from "next/cache";

export async function createProject(prevState: any, formData: FormData): Promise<{
  success?: boolean;
  error?: string;
  message?: string;
}> {
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Project name is required" };
  }

  try {
    const response = await ProjectsService.createProject({
      name,
      description: "Description",
    });

    if (response.ok) {
      // Revalidate the page to show the new project
      revalidatePath("/");
      return { success: true, message: "Project created successfully!" };
    } else {
      return { error: "Failed to create project" };
    }
  } catch (error) {
    return { error: "An error occurred while creating the project" };
  }
}

export async function deleteProject(prevState: any, formData: FormData) {
  const projectId = formData.get("projectId") as string;

  try {
    const response = await ProjectsService.deleteProject(projectId);
    if (response.ok) {
      revalidatePath("/");
      return { success: true, message: "Project deleted successfully!" };
    } else {
      return { success: false, message: "Failed to delete project" };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the project",
    };
  }
}
