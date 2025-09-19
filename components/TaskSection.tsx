import TaskFileCard from "@/app/projects/[id]/generate/TaskFileCard";
import { useUserTasks } from "@/lib/providers/UserTaskProvider";
import { Project } from "@/lib/types/project";

export default function TaskSection({ project }: { project: Project }) {
  const { getTasksForProject } = useUserTasks();
  const tasks = getTasksForProject(project.id);
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-6">Tasks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tasks.map((task) => (
          <TaskFileCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
