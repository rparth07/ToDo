import { Component, OnInit } from '@angular/core';
import { TaskStatus, TaskType } from '../Constants';
import { Task } from '../Task';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit {
  allTasks!: Task[];
  tasksToDisplay: Task[] = this.allTasks;
  showProperty: TaskType = TaskType.ALL;

  constructor(
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.allTasks = this.taskService.allTasks;//replace with get method
    this.tasksToDisplay = this.allTasks;

    this.taskService.getRefreshTaskListEventEmitter()
      .subscribe(msg => {
        this.allTasks = this.taskService.allTasks;
        this.refreshTaskList();
        console.log(msg);
      });
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
