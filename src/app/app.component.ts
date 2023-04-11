import { Component } from '@angular/core';
import { TaskType, TaskStatus, TaskPriority } from './Constants';
import { Task } from './Task';
import { faTag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  faTag = faTag;
  allTasks: Task[] = [
    {
      name: 'Task1',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
    },
    {
      name: 'Task2',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.INPROGRESS,
    },
    {
      name: 'Task3',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.COMPLETED,
    },
    {
      name: 'Task4',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.INPROGRESS,
    },
    {
      name: 'Task5',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
    },
    {
      name: 'Task6',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
    },
  ];
  tasksToDisplay: Task[] = this.allTasks;
  showProperty: TaskType = TaskType.ALL;

  getFormattedDate(date: Date): string {
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  getClassFromPriority(priority: TaskPriority): string {
    console.log('task status = ' + status);
    if (priority === TaskPriority.HIGH) {
      return 'text-high';
    } else if (priority === TaskPriority.MEDIUM) {
      return 'text-medium';
    } else if (priority === TaskPriority.LOW) {
      return 'text-low';
    }
    return 'text-secondary';
  }

  displayAllTasks(event: Event) {
    this.showProperty = TaskType.ALL;
    this.tasksToDisplay = this.allTasks;
  }

  displayToDoTasks(event: Event) {
    this.showProperty = TaskType.TODO;
    this.tasksToDisplay = this.allTasks.filter(
      (x) => x.status == TaskStatus.TODO
    );
  }

  displayInProgressTasks(event: Event) {
    this.showProperty = TaskType.INPROGRESS;
    this.tasksToDisplay = this.allTasks.filter(
      (x) => x.status == TaskStatus.INPROGRESS
    );
  }

  displayCompletedTasks(event: Event) {
    this.showProperty = TaskType.COMPLETED;
    this.tasksToDisplay = this.allTasks.filter(
      (x) => x.status == TaskStatus.COMPLETED
    );
  }
}
