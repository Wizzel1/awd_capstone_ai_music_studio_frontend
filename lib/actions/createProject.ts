"use server";

import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Project name is required");
  }

  // Here you would typically save to a database
  // For now, we'll just simulate the action
  console.log("Creating project:", name);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Revalidate the page to show the new project
  revalidatePath("/");

  // You could also redirect to the new project page if needed
  // redirect(`/projects/${newProjectId}`);
}
