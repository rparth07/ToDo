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
}
