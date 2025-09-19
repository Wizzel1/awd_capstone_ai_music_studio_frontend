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
import { useActionState, useEffect, useState } from "react";

type ActionState = {
  success?: boolean;
  error?: string;
  message?: string;
} | null;

export function NewProjectDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createProject,
    null
  );

  // Close dialog when project is created successfully
  useEffect(() => {
    if (state && !state.error) {
      setOpen(false);
    }
  }, [state]);

  function SubmitButton() {
    return (
      <Button
        type="submit"
        disabled={isPending}
        className="bg-zinc-900 hover:bg-zinc-800 text-white"
      >
        {isPending ? "Creating..." : "Create Project"}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form action={formAction} className="space-y-6">
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
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
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
