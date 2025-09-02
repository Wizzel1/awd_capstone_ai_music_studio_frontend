import { NewProjectDialog } from "@/components/NewProjectDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectsService } from "@/lib/services/projectsService";
import Link from "next/link";

export default async function Dashboard() {
  const projects = await ProjectsService.getProjects();

  return (
    <div className="space-y-8">
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
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-zinc-200 hover:border-zinc-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-zinc-900 group-hover:text-zinc-700">
                  {project.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  {/* <span>{project.fileCount} Files</span> */}
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
