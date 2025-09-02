"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProject } from "@/lib/actions/createProject";
import { Project } from "@/lib/services/projectsService";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "./ui/button";

export default function ProjectCard({ project }: { project: Project }) {
  const deletionFormRef = useRef<HTMLFormElement>(null);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the button click from triggering the link
    e.preventDefault();
    deletionFormRef.current?.requestSubmit();
  };

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-zinc-200 hover:border-zinc-300 hover:-translate-y-1">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-zinc-900 group-hover:text-zinc-700">
              {project.name}
            </CardTitle>
            <form action={deleteProject} ref={deletionFormRef}>
              <input type="hidden" name="projectId" value={project.id} />
            </form>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
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
