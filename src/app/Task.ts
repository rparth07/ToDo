import { TaskPriority, TaskStatus } from './Constants';

export type Task = {
  id: number;
  name: String;
  description: String | undefined;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
}
