import { Component, Input, OnInit } from '@angular/core';
import { TaskPriority, TaskStatus } from 'src/app/Constants';
import { Task } from 'src/app/Task';
import { TaskService } from 'src/app/task-page/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  @Input() shouldDisplayTaskSeparator: boolean = true;
  
  displayOptions: boolean = true;

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.getDisableOptionEventEmitter()
      .subscribe(id => this.displayOptions = this.task?.id != id);
  }

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

  updateTaskStatus(status: TaskStatus) {
    this.task.status = status;
    this.taskService.upsertTaskInTaskList(this.task);
  }
  
  //move to service
  openEditTaskCardModel(task: Task) {
    this.taskService.disableOptionForTask(task.id);
    this.taskService.updateTask(task);
  }

  deleteTaskFromList(task: Task, taskDiv: HTMLDivElement) {
    taskDiv.classList.add('delete-task');
    setTimeout(() => {
      console.log('started');
      this.taskService.deleteTaskFromList(task);
    }, 2000);
  }
}
