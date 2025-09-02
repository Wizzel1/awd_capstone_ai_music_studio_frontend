"use server";

import { ProjectsService } from "@/lib/services/projectsService";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Project name is required");
  }

  const response = await ProjectsService.createProject({
    name,
    description: "Description",
  });

  if (response.ok) {
    // Revalidate the page to show the new project
    revalidatePath("/");
  } else {
    throw new Error("Failed to create project");
  }
  // You could also redirect to the new project page if needed
  // redirect(`/projects/${newProjectId}`);
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
