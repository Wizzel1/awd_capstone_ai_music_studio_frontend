import { NewProjectDialog } from "@/components/NewProjectDialog";
import ProjectCard from "@/components/ProjectCard";
import { ProjectsService } from "@/lib/services/projectsService";

export default async function Dashboard() {
  const projects = await ProjectsService.getProjects();

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Projects</h1>
          <p className="text-zinc-600 mt-1">
            Manage your AI music studio projects
          </p>
        </div>
        <NewProjectDialog />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
