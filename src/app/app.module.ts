import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule  } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TaskPageComponent } from './task-page/task-page.component';
import { TaskModifierComponent } from './task-page/task-modifier/task-modifier.component';
import { TaskListComponent } from './task-page/task-container/task-list/task-list.component';
import { TaskMenuComponent } from './task-page/task-container/task-menu/task-menu.component';
import { TaskComponent } from './task-page/task-container/task-list/task/task.component';
import { TaskStatusComponent } from './task-page/task-container/task-list/task/task-status/task-status.component';

@NgModule({
  declarations: [AppComponent, TaskPageComponent, TaskModifierComponent, TaskListComponent, TaskMenuComponent, TaskStatusComponent, TaskComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    FontAwesomeModule,
    AppRoutingModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRippleModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
