import { VideoWorkflowProvider } from "@/lib/providers/VideoWorkflowProvider";
import { ProjectsService } from "@/lib/services/projectsService";
import FileManager from "./FileManager";
import WorkflowManager from "./WorkflowManager";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
  const project = await ProjectsService.getProject(projectId);

  if (!project) return <div>Loading...</div>;

  // For now, we'll use a URL parameter to toggle between flows
  // Later this can be a user preference or feature flag
  const useNewWorkflow = true; // TODO: Make this configurable

  if (useNewWorkflow) {
    return (
      <VideoWorkflowProvider>
        <WorkflowManager project={project} />
      </VideoWorkflowProvider>
    );
  }

  return (
    <div className="space-y-6">
      <FileManager project={project} />
    </div>
  );
}
