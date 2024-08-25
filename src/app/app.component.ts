import { Component, ViewChild } from '@angular/core';
import { TaskType, TaskStatus, TaskPriority } from './Constants';
import { Task } from './Task';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
//"node_modules/font-awesome/css/font-awesome.css" - add this to app.module styles

@Component({
  selector: 'app-root',
  animations: [
    trigger('taskSwitchAnimation', [
      transition(':enter', [
        style({ opacity: 1 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('100ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('heightAnimation', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('250ms', style({ height: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*' }),
        animate('250ms', style({ height: '0px' })),
      ]),
    ]),
    // trigger('deleteAnimation', [
    //   transition(':enter', [
    //     style({ height: '0px' }),
    //     animate('250ms', style({ height: '*' })),
    //   ]),
    //   transition(':leave', [
    //     style({ height: '*' }),
    //     animate('250ms', style({ height: '0px' })),
    //   ]),
    // ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  shouldDisplayForm: Boolean = false;
  taskToEdit: Task | null = null;

  taskPriorities: string[] = ['Low', 'Medium', 'High'];

  taskStatusTypes: string[] = ['To Do', 'In Progress', 'Completed'];

  allTasks: Task[] = [
    {
      id: 1,
      name: 'Complete main UI components',
      description:
        'Would be good if we include every components in design system',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
    },
    {
      id: 2,
      name: 'Task2',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.INPROGRESS,
    },
    {
      id: 3,
      name: 'Task3',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.COMPLETED,
    },
    {
      id: 4,
      name: 'Task4',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.INPROGRESS,
    },
    {
      id: 5,
      name: 'Task5',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
    },
    {
      id: 6,
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
    return date?.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  getClassFromPriority(priority: TaskPriority): string {
    if (priority.toUpperCase() === TaskPriority.HIGH.toUpperCase()) {
      return 'text-high';
    } else if (priority.toUpperCase() === TaskPriority.MEDIUM.toUpperCase()) {
      return 'text-medium';
    } else if (priority.toUpperCase() === TaskPriority.LOW.toUpperCase()) {
      return 'text-low';
    }
    return 'text-secondary';
  }
  //create 3 methods to display
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

  //need to change out of 3
  toggleMarkAsCompleted(taskToComplete: Task) {
    this.allTasks.forEach((task, i) => {
      if (taskToComplete.id === task.id) {
        this.allTasks[i].status =
          this.allTasks[i].status != TaskStatus.COMPLETED
            ? TaskStatus.COMPLETED
            : TaskStatus.TODO;
      }
    });
    this.displayTasks();
  }

  displayTasks() {
    // this.allTasks.sort((a, b) => b.id - a.id);
    if (this.showProperty == TaskType.TODO) {
      this.displayToDoTasks();
    } else if (this.showProperty == TaskType.INPROGRESS) {
      this.displayInProgressTasks();
    } else if (this.showProperty == TaskType.COMPLETED) {
      this.displayCompletedTasks();
    } else {
      this.displayAllTasks();
    }
  }

  upsertTaskInTaskList(form: NgForm) {
    let formData: Task = form.value;
    if (this.taskToEdit === null) {
      this.addTaskInTaskList(formData);
      form.resetForm();
    } else {
      this.updateTaskInTaskList(formData);
    }
  }

  addTaskInTaskList(taskToAdd: Task) {
    this.allTasks.sort((a, b) => b.id - a.id);
    taskToAdd.id =
      this.allTasks.length > 0
        ? ++this.allTasks[this.allTasks.length - 1].id
        : 1;
    this.allTasks.push(taskToAdd);
  }

  updateTaskInTaskList(taskToUpdate: Task) {
    this.allTasks.forEach((_) => {
      if (_.id == taskToUpdate.id) {
        _.name = taskToUpdate.name;
        _.description = taskToUpdate.description;
        _.dueDate = taskToUpdate.dueDate;
        _.priority = taskToUpdate.priority;
        _.status = taskToUpdate.status;
      }
    });

    this.displayTasks();
  }

  displayForm() {
    this.shouldDisplayForm = true;
  }

  hideForm() {
    this.taskToEdit = null;
    this.shouldDisplayForm = false;
  }

  openEditTaskCardModel(task: Task) {
    this.taskToEdit = task;
    this.displayForm();
  }

  deleteTaskFromList(task: Task, taskDiv: HTMLDivElement) {
    taskDiv.classList.add('delete-task');
    setTimeout(() => {
      console.log('started');
      this.allTasks = this.allTasks.filter((_) => _.id != task.id);
      // this.tasksToDisplay = this.tasksToDisplay.filter((_) => _.id != task.id);
      this.displayTasks();
    }, 2000);
  }
}
