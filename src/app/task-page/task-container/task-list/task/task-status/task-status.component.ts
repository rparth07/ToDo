import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from 'src/app/Constants';
import { Task } from 'src/app/Task';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent {
  @Input() taskStatus: TaskStatus;
  @Output() updateTaskStatusEventEmitter = new EventEmitter<TaskStatus>();

  constructor() {
    this.taskStatus = TaskStatus.TODO;
  }
  
  //need to change out of todo, inprogress, completed
  toggleMarkAsCompleted() {
    this.taskStatus = this.taskStatus == TaskStatus.COMPLETED ?
    TaskStatus.TODO : TaskStatus.COMPLETED;

    this.updateTaskStatusEventEmitter.emit(this.taskStatus);
  }
}
