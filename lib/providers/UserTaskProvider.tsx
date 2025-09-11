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
  getProjectIdByTaskId: (taskId: string) => string | undefined;
  refreshTasks: () => void;
  isConnected: boolean;
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
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const getTasks = useCallback(() => {
    TaskService.getTasksForUser().then(setUserTasks);
  }, []);

  useEffect(() => {
    // Initial load of tasks
    getTasks();

    // Connect to SSE stream for real-time updates
    const connectToTasks = () => {
      const eventSource = TaskService.createTasksSSEConnection();

      eventSource.onopen = () => {
        console.log('Connected to tasks stream');
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const updatedTask: Task = JSON.parse(event.data);
          
          setUserTasks(prev => {
            const existingIndex = prev.findIndex(task => task.id === updatedTask.id);
            
            if (existingIndex !== -1) {
              // Update existing task
              const newTasks = [...prev];
              newTasks[existingIndex] = updatedTask;
              return newTasks;
            } else {
              // Add new task
              return [...prev, updatedTask];
            }
          });
        } catch (error) {
          console.error('Error parsing task update:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToTasks();
          }
        }, 5000);
      };

      eventSourceRef.current = eventSource;
    };

    connectToTasks();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [getTasks]);

  const getTasksForProject = useCallback(
    (projectId: string) => {
      return userTasks.filter((task) => task.projectId === projectId);
    },
    [userTasks]
  );

  const getProjectIdByTaskId = useCallback(
    (taskId: string) => {
      const task = userTasks.find((t) => t.id === taskId);
      return task?.projectId;
    },
    [userTasks]
  );

  return (
    <UserTaskContext.Provider
      value={{ 
        getTasksForProject, 
        getProjectIdByTaskId, 
        refreshTasks: getTasks,
        isConnected 
      }}
    >
      {children}
    </UserTaskContext.Provider>
  );
};
