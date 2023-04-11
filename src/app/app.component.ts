import { Component } from '@angular/core';
import { TaskType, TaskStatus, TaskPriority } from './Constants';
import { Task } from './Task';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  faTag = faTag;
  allTasks: Task[] = [
    {
      name: 'Complete main UI components',
      description:
        'Would be good if we include every components in design system',
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

  displayAllTasks() {
    this.showProperty = TaskType.ALL;
    this.tasksToDisplay = this.allTasks;
  }

  displayToDoTasks() {
    this.showProperty = TaskType.TODO;
    this.tasksToDisplay = this.allTasks.filter(
      (x) => x.status == TaskStatus.TODO
    );
  }

  displayInProgressTasks() {
    this.showProperty = TaskType.INPROGRESS;
    this.tasksToDisplay = this.allTasks.filter(
      (x) => x.status == TaskStatus.INPROGRESS
    );
  }

  displayCompletedTasks() {
    this.showProperty = TaskType.COMPLETED;
    this.tasksToDisplay = this.allTasks.filter(
      (x) => x.status == TaskStatus.COMPLETED
    );
  }

  toggleMarkAsCompleted(taskToComplete: Task) {
    this.allTasks.map((task, i) => {
      if (
        taskToComplete.name === task.name &&
        taskToComplete.description === task.description &&
        taskToComplete.dueDate === task.dueDate &&
        taskToComplete.priority === task.priority &&
        taskToComplete.status === task.status
      ) {
        this.allTasks[i].status != TaskStatus.COMPLETED
          ? (this.allTasks[i].status = TaskStatus.COMPLETED)
          : (this.allTasks[i].status = TaskStatus.TODO);
      }
    });

    this.showProperty == TaskType.TODO
      ? this.displayToDoTasks()
      : this.showProperty == TaskType.INPROGRESS
      ? this.displayInProgressTasks()
      : this.showProperty == TaskType.COMPLETED
      ? this.displayCompletedTasks()
      : this.displayAllTasks();
  }

  addTask(f: NgForm) {
    console.log(f.value); // { first: '', last: '' }
    console.log(f.valid); // false
  }
}
