import { Task } from "@/lib/types/task";

export default function TaskFileCard({ task }: { task: Task }) {
  const { status, error } = task;

  return (
    <div className="relative aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hiddenborder-zinc-200 hover:border-zinc-300 hover:shadow-sm">
      <h1>{status}</h1>
      <p>{error}</p>
    </div>
  );
}
