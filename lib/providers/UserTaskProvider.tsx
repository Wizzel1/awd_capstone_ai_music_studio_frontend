"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TaskService } from "../services/taskService";
import { Task } from "../types/task";
interface UserTaskContextType {
  userTasks: Task[];
  getTasksForProject: (projectId: string) => Task[];
}

const UserTaskContext = createContext<UserTaskContextType | undefined>(
  undefined
);

export const useUserTasks = () => {
  const context = useContext(UserTaskContext);
  if (!context) {
    throw new Error("useUserTasks must be used within a UserTaskProvider");
  }
  return context;
};

export const UserTaskProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      TaskService.getTasksForUser().then((tasks) => {
        setUserTasks(tasks);
      });
    }, 10000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });
  const getTasksForProject = (projectId: string) => {
    return userTasks.filter(
      (task) => task.projectId === projectId && task.status === "running"
    );
  };

  return (
    <UserTaskContext.Provider value={{ userTasks, getTasksForProject }}>
      {children}
    </UserTaskContext.Provider>
  );
};
