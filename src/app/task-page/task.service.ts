import { EventEmitter, Injectable } from '@angular/core';
import { TaskPriority, TaskStatus } from '../Constants';
import { Task } from '../Task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly storageKey = 'rparth07-todo.tasks.v1';
  private savedValue: string | null = null;
  private storageLoaded = false;
  allTasks: Task[] = [];
  error = '';
  editTaskEventEmitter = new EventEmitter<Task>();
  refreshTaskListEventEmitter = new EventEmitter<string>();
  disableOptionEventEmitter = new EventEmitter<number | null>();

  constructor() { this.reloadTasks(); }

  reloadTasks(): boolean {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const values: unknown = raw === null ? [] : JSON.parse(raw);
      if (!Array.isArray(values)) { throw new Error('Invalid task data'); }
      const tasks = values.map(value => this.normalizeTask(value));
      const ids = tasks.map(task => task.id);
      if (ids.some(id => id === null) || new Set(ids).size !== ids.length) {
        throw new Error('Invalid task IDs');
      }
      this.allTasks = tasks;
      this.savedValue = raw;
      this.storageLoaded = true;
      this.error = '';
      this.refreshTaskList();
      return true;
    } catch {
      this.storageLoaded = false;
      this.error = 'Saved tasks could not be read. Your saved data has not been changed. Check browser storage access, then retry.';
      return false;
    }
  }

  private normalizeTask(value: any): Task {
    if (!value || typeof value.name !== 'string' || !value.name.trim() ||
        (value.id !== null && (!Number.isSafeInteger(value.id) || value.id < 1)) ||
        (value.description != null && typeof value.description !== 'string') ||
        !Object.values(TaskPriority).includes(value.priority) ||
        !Object.values(TaskStatus).includes(value.status)) {
      throw new Error('Invalid task');
    }
    const dueDate = new Date(value.dueDate);
    const createdDate = new Date(value.createdDate);
    if (value.dueDate == null || value.createdDate == null ||
        !Number.isFinite(dueDate.getTime()) || !Number.isFinite(createdDate.getTime())) {
      throw new Error('Invalid date');
    }
    return { ...value, name: value.name.trim(), description: value.description ?? undefined, dueDate, createdDate };
  }

  private save(tasks: Task[]): boolean {
    if (!this.storageLoaded) { return false; }
    try {
      if (localStorage.getItem(this.storageKey) !== this.savedValue) {
        this.error = 'Tasks changed in another tab. Retry loading saved tasks, then submit your changes again.';
        return false;
      }
      const raw = JSON.stringify(tasks);
      localStorage.setItem(this.storageKey, raw);
      this.savedValue = raw;
      this.allTasks = tasks;
      this.error = '';
      this.refreshTaskList();
      return true;
    } catch {
      this.error = 'Changes could not be saved. Your previous tasks and current form are preserved. Check browser storage space and access, then try again.';
      return false;
    }
  }

  upsertTaskInTaskList(task: Task): boolean {
    try {
      const existing = this.allTasks.find(item => item.id === task.id);
      if (task.id !== null && !existing) { throw new Error('Missing task'); }
      const id = existing ? existing.id : Math.max(0, ...this.allTasks.map(item => item.id || 0)) + 1;
      const next = this.normalizeTask({ ...task, id, createdDate: existing?.createdDate || new Date() });
      return this.save(existing
        ? this.allTasks.map(item => item.id === id ? next : item)
        : [...this.allTasks, next]);
    } catch {
      this.error = 'Enter a task name, valid due date, priority and status. If this task was removed, cancel editing and add it again.';
      return false;
    }
  }

  addTaskInTaskList(task: Task): boolean { return this.upsertTaskInTaskList({ ...task, id: null }); }
  updateTaskInTaskList(task: Task): boolean { return this.upsertTaskInTaskList(task); }
  deleteTaskFromList(task: Task): boolean {
    return this.save(this.allTasks.filter(item => item.id !== task.id));
  }
  disableOptionForTask(id: number | null) { this.disableOptionEventEmitter.emit(id); }
  getDisableOptionEventEmitter() { return this.disableOptionEventEmitter; }
  updateTask(task: Task) { this.editTaskEventEmitter.emit({ ...task }); }
  getEditTaskEventEmitter() { return this.editTaskEventEmitter; }
  refreshTaskList() { this.refreshTaskListEventEmitter.emit('task list refreshed'); }
  getRefreshTaskListEventEmitter() { return this.refreshTaskListEventEmitter; }
}
