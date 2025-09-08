"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProject } from "@/lib/actions/createProject";
import { Project } from "@/lib/types/project";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function ProjectCard({ project }: { project: Project }) {
  const [state, formAction, isPending] = useActionState(deleteProject, null);
  const deletionFormRef = useRef<HTMLFormElement>(null);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the button click from triggering the link
    e.preventDefault();
    //TODO show dialog to confirm deletion
    if (confirm("Are you sure you want to delete this project?")) {
      deletionFormRef.current?.requestSubmit();
    }
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-zinc-200 hover:border-zinc-300 hover:-translate-y-1">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-zinc-900 group-hover:text-zinc-700">
              {project.name}
            </CardTitle>
            <form action={formAction} ref={deletionFormRef}>
              <input type="hidden" name="projectId" value={project.id} />
            </form>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isPending}
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
