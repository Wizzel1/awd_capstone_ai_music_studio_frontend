import { Task } from "@/lib/types/task";

export default function TaskFileCard({ task }: { task: Task }) {
  const { status, error } = task;

  return (
    <div>
      <h1>{status}</h1>
      <p>{error}</p>
    </div>
  );
}
