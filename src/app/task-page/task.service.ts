import { EventEmitter, Injectable, Output } from '@angular/core';
import { TaskPriority, TaskStatus, TaskType } from '../Constants';
import { Task } from '../Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  @Output() editTaskEventEmitter = new EventEmitter<Task>();
  @Output() refreshTaskListEventEmitter = new EventEmitter<string>();
  @Output() disableOptionEventEmitter = new EventEmitter<number | null>();

  disableOptionForTask(id: number | null) {
    this.disableOptionEventEmitter.emit(id);
  }

  getDisableOptionEventEmitter() {
    return this.disableOptionEventEmitter;
  }

  updateTask(value: Task) {
    this.editTaskEventEmitter.emit(value);
  }

  getEditTaskEventEmitter() {
    return this.editTaskEventEmitter;
  }

  allTasks: Task[] = [
    {
      id: 1,
      name: 'Complete main UI components',
      description:
        'Would be good if we include every components in design system',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      createdDate: new Date()
    },
    {
      id: 2,
      name: 'Task2',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      createdDate: new Date()
    },
    {
      id: 3,
      name: 'Task3',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      createdDate: new Date()
    },
    {
      id: 4,
      name: 'Task4',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.INPROGRESS,
      createdDate: new Date()
    },
    {
      id: 5,
      name: 'Task5',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
      createdDate: new Date()
    },
    {
      id: 6,
      name: 'Task6',
      description: 'This is desc',
      dueDate: new Date(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
      createdDate: new Date()
    },
  ];

  upsertTaskInTaskList(task: Task) {
    if (task.id === null) {
      this.addTaskInTaskList(task);
    } else {
      this.updateTaskInTaskList(task);
    }
  }

  addTaskInTaskList(taskToAdd: Task) {//need to refactor this function and sorting
    this.allTasks.sort((a, b) => {
      if(a.id == null) {
        return -1;
      }
      if(b.id == null)
      {
        return 1;
      }
      return b.id - a.id;
    });
    taskToAdd.id =
      this.allTasks.length > 0 
        ? this.allTasks[this.allTasks.length - 1].id
        : 0;
    taskToAdd.id = taskToAdd.id == null ? null : ++taskToAdd.id;
    this.allTasks.push(taskToAdd);
    this.allTasks.sort((a, b) => {
      if(a.id == null) {
        return 1;
      }
      if(b.id == null)
      {
        return -1;
      }
      return a.id - b.id;
    });
    this.refreshTaskList();
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

    this.refreshTaskList();
  }

  deleteTaskFromList(task: Task) {
    setTimeout(() => {
      console.log('started');
      this.allTasks = this.allTasks.filter((_) => _.id != task.id);
      this.refreshTaskList();
    }, 100);
  }

  refreshTaskList() {//trigger event and capture it in task-list

    this.refreshTaskListEventEmitter
      .emit('task list refreshed');
  }

  getRefreshTaskListEventEmitter() {
    return this.refreshTaskListEventEmitter;
  }

  // displayForm() {//trigger event and capture it in task-modifier
  //   var shouldDisplayForm = true;
  // }

}
