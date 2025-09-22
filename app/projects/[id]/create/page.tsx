import { VideoWorkflowProvider } from "@/lib/providers/VideoWorkflowProvider";
import { ProjectsService } from "@/lib/services/projectsService";
import WorkflowManager from "../WorkflowManager";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
  const project = await ProjectsService.getProject(projectId);

  if (!project) return <div>Loading...</div>;

  return (
    <VideoWorkflowProvider>
      <WorkflowManager project={project} />
    </VideoWorkflowProvider>
  );
}
