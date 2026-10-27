import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskStatus, TaskType } from '../Constants';
import { Task } from '../Task';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, OnDestroy {
  allTasks: Task[] = [];
  private subscription?: Subscription;
  tasksToDisplay: Task[] = this.allTasks;
  showProperty: TaskType = TaskType.ALL;

  constructor(
    public taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.allTasks = this.taskService.allTasks;//replace with get method
    this.tasksToDisplay = this.allTasks;

    this.subscription = this.taskService.getRefreshTaskListEventEmitter()
      .subscribe(msg => {
        this.allTasks = this.taskService.allTasks;
        this.refreshTaskList();

      });
  }

    ngOnDestroy(): void { this.subscription?.unsubscribe(); }

    // Filter the current saved task list.
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

    refreshTaskList() {
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

}
