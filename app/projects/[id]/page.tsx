import { ProjectsService } from "@/lib/services/projectsService";
import FileManager from "./FileManager";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
  const project = await ProjectsService.getProject(projectId as string);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <FileManager project={project} />
    </div>
  );
}
