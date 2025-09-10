"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TaskService } from "../services/taskService";
import { Task } from "../types/task";
interface UserTaskContextType {
  userTasks: Task[];
  getTasksForProject: (projectId: string) => Task[];
  refreshTasks: () => Promise<void>;
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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    TaskService.getTasksForUser().then((tasks) => {
      setUserTasks(tasks);
    });
    intervalRef.current = setInterval(() => {
      TaskService.getTasksForUser().then((tasks) => {
        setUserTasks(tasks);
      });
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const getTasksForProject = useCallback(
    (projectId: string) => {
      return userTasks.filter((task) => task.projectId === projectId);
    },
    [userTasks]
  );

  const refreshTasks = useCallback(async () => {
    const tasks = await TaskService.getTasksForUser();
    setUserTasks(tasks);
  }, []);

  return (
    <UserTaskContext.Provider
      value={{ userTasks, getTasksForProject, refreshTasks }}
    >
      {children}
    </UserTaskContext.Provider>
  );
};
