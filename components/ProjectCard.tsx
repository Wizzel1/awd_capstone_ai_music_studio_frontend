import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/lib/services/projectsService";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <>
      <Link href={`/projects/${project.id}`}>
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
    </>
  );
}
