import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/Task';
import { TaskService } from '../task.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-modifier',
  animations: [
    trigger('heightAnimation', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('250ms', style({ height: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*' }),
        animate('250ms', style({ height: '0px' })),
      ]),
    ])],
  templateUrl: './task-modifier.component.html',
  styleUrls: ['./task-modifier.component.css']
})
export class TaskModifierComponent implements OnInit	{
  taskToEdit:Task | null;
  shouldDisplayForm: boolean;

  taskPriorities: string[];
  taskStatusTypes: string[];
  
  constructor(private taskService: TaskService) {
    this.taskPriorities = ['High', 'Medium', 'Low'];
    this.taskStatusTypes = ['To Do', 'In Progress', 'Completed'];
    this.taskToEdit = null;
    this.shouldDisplayForm = false;
  }

  ngOnInit(): void {
    this.taskService.getEditTaskEventEmitter()
      .subscribe(item => {
        this.taskToEdit = item;
        this.shouldDisplayForm = true;
        this.taskService.disableOptionForTask(this.taskToEdit.id);
      });
  }

  upsertTaskInTaskList(form: NgForm) {
    let task: Task = form.value;
    task.id = this.taskToEdit?.id == undefined ? null : this.taskToEdit.id;
    this.taskService.upsertTaskInTaskList(task);
    form.resetForm();
    this.hideForm();
  }

  displayForm() {
    this.shouldDisplayForm = true;
  }

  //need to remove
  hideForm() {
    this.taskService.disableOptionForTask(null);
    this.taskToEdit = null;
    this.shouldDisplayForm = false;
  }
}
