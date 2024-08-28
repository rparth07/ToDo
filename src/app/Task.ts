import { TaskPriority, TaskStatus } from './Constants';

export type Task = {
  id: number | null;
  name: string;
  description: string | undefined;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdDate: Date;
}
