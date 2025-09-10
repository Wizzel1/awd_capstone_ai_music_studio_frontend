import TaskFileCard from "@/app/projects/[id]/TaskFileCard";
import { Project } from "@/lib/types/project";
import { useEffect, useRef } from "react";

export default function TaskSection({ project }: { project: Project }) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      //   router.refresh();
      console.log("refreshing tasks");
    }, 10000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-6">Tasks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {project.tasks?.map(
          (task) =>
            task.status === "running" && (
              <TaskFileCard key={task.id} task={task} />
            )
        )}
      </div>
    </div>
  );
}
