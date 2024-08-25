import { Component, Input } from '@angular/core';
import { Task } from 'src/app/Task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() taskList!: Task[];
}
