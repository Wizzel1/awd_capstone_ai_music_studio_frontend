import { NewProjectDialog } from "@/components/NewProjectDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: "Marriage Video",
      fileCount: 10,
    },
    {
      id: 2,
      name: "Project 2",
      fileCount: 10,
    },
    {
      id: 3,
      name: "Project 2",
      fileCount: 10,
    },
    {
      id: 4,
      name: "Project 2",
      fileCount: 10,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-zinc-900">Projects</h2>
        <NewProjectDialog />
      </div>

      <div className="grid grid-cols-5 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer bg-white border-zinc-200 hover:border-zinc-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-zinc-900">
                  {project.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-zinc-600">
                  {project.fileCount} Files
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
