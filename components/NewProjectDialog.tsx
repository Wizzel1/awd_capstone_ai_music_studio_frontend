"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createProject } from "@/lib/actions/createProject";
import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

export function NewProjectDialog({ children }: { children?: React.ReactNode }) {
  function SubmitButton() {
    const { pending } = useFormStatus(); // This works because it's inside the form
    return (
      <Button
        type="submit"
        disabled={pending}
        className="bg-zinc-900 hover:bg-zinc-800 text-white"
      >
        {pending ? "Creating..." : "Create Project"}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
          <p className="text-sm text-zinc-600">
            Give your AI music studio project a memorable name.
          </p>
        </DialogHeader>
        <form action={createProject} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="text-sm font-medium text-zinc-700"
            >
              Project Name
            </label>
            <Input
              id="project-name"
              name="name"
              placeholder="Enter project name..."
              className="h-11"
              required
            />
          </div>
          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
