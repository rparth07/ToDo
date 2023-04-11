import { TaskPriority, TaskStatus } from './Constants';

export interface Task {
  name: String;
  description: String | undefined;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
}
