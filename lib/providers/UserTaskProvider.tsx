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
  getTasksForProject: (projectId: string) => Task[];
  refreshTasks: () => void;
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

  const getTasks = useCallback(() => {
    TaskService.getTasksForUser().then(setUserTasks);
  }, []);

  useEffect(() => {
    getTasks();
    intervalRef.current = setInterval(getTasks, 10000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getTasksForProject = useCallback(
    (projectId: string) => {
      return userTasks.filter((task) => task.projectId === projectId);
    },
    [userTasks]
  );

  return (
    <UserTaskContext.Provider
      value={{ getTasksForProject, refreshTasks: getTasks }}
    >
      {children}
    </UserTaskContext.Provider>
  );
};
