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

export function NewProjectDialog() {
  function SubmitButton() {
    const { pending } = useFormStatus(); // This works because it's inside the form
    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create"}
      </Button>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <form action={createProject} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="project-name" name="name" placeholder="Project Name" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
