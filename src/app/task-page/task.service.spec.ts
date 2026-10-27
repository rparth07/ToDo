import { TaskService } from './task.service';
import { TaskPriority, TaskStatus } from '../Constants';
import { Task } from '../Task';

describe('TaskService persistence', () => {
  let store: Record<string, string>;
  let service: TaskService;
  const task = (name = 'Test task'): Task => ({ id: null, name, description: 'Details', dueDate: new Date(2030, 0, 1), createdDate: new Date(), priority: TaskPriority.HIGH, status: TaskStatus.TODO });
  beforeEach(() => {
    store = {};
    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => store[key] ?? null);
    spyOn(Storage.prototype, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
    service = new TaskService();
  });
  it('starts empty without inserting demo tasks', () => { expect(service.allTasks).toEqual([]); });
  it('assigns distinct IDs and changes only the selected task', () => {
    service.addTaskInTaskList(task('First'));
    service.addTaskInTaskList(task('Second'));
    service.addTaskInTaskList(task('Third'));
    expect(new Set(service.allTasks.map(value => value.id)).size).toBe(3);
    const second = service.allTasks[1];
    service.updateTaskInTaskList({ ...second, name: 'Updated' });
    expect(service.allTasks.map(value => value.name)).toEqual(['First', 'Updated', 'Third']);
    service.deleteTaskFromList(second);
    expect(service.allTasks.map(value => value.name)).toEqual(['First', 'Third']);
  });
  it('reloads tasks and hydrates dates', () => {
    service.addTaskInTaskList(task());
    const loaded = new TaskService();
    expect(loaded.allTasks[0].name).toBe('Test task');
    expect(loaded.allTasks[0].dueDate instanceof Date).toBeTrue();
    expect(loaded.allTasks[0].createdDate instanceof Date).toBeTrue();
  });
  it('persists completion and reopening', () => {
    service.addTaskInTaskList(task());
    service.updateTaskInTaskList({ ...service.allTasks[0], status: TaskStatus.COMPLETED });
    expect(new TaskService().allTasks[0].status).toBe(TaskStatus.COMPLETED);
    service.updateTaskInTaskList({ ...service.allTasks[0], status: TaskStatus.TODO });
    expect(new TaskService().allTasks[0].status).toBe(TaskStatus.TODO);
  });
  it('preserves creation dates when editing', () => {
    service.addTaskInTaskList(task());
    const original = service.allTasks[0];
    service.updateTaskInTaskList({ ...original, name: 'Edited', createdDate: new Date(2000, 0, 1) });
    expect(service.allTasks[0].createdDate).toEqual(original.createdDate);
  });
  it('rejects blank titles, invalid dates and invalid enum values', () => {
    expect(service.addTaskInTaskList(task('   '))).toBeFalse();
    expect(service.addTaskInTaskList({ ...task(), dueDate: new Date('invalid') })).toBeFalse();
    expect(service.addTaskInTaskList({ ...task(), status: 'invalid' as TaskStatus })).toBeFalse();
    expect(service.allTasks.length).toBe(0);
  });
  it('does not mutate state when saving fails', () => {
    service.addTaskInTaskList(task());
    const before = service.allTasks;
    (Storage.prototype.setItem as jasmine.Spy).and.throwError('Quota exceeded');
    expect(service.addTaskInTaskList(task('Unsaved'))).toBeFalse();
    expect(service.updateTaskInTaskList({ ...before[0], status: TaskStatus.COMPLETED })).toBeFalse();
    expect(service.deleteTaskFromList(before[0])).toBeFalse();
    expect(service.allTasks).toBe(before);
    expect(service.error).toContain('could not be saved');
  });
  it('preserves corrupt saved data and blocks writes', () => {
    store['rparth07-todo.tasks.v1'] = 'corrupt';
    service = new TaskService();
    expect(service.addTaskInTaskList(task())).toBeFalse();
    expect(store['rparth07-todo.tasks.v1']).toBe('corrupt');
    expect(service.error).toContain('could not be read');
  });
  it('rejects duplicate stored IDs without replacing data', () => {
    service.addTaskInTaskList(task());
    const value = service.allTasks[0];
    const raw = JSON.stringify([value, value]);
    store['rparth07-todo.tasks.v1'] = raw;
    expect(service.reloadTasks()).toBeFalse();
    expect(store['rparth07-todo.tasks.v1']).toBe(raw);
  });
  it('detects changes in another tab and supports retry', () => {
    const otherTab = new TaskService();
    service.addTaskInTaskList(task('Saved elsewhere'));
    expect(otherTab.addTaskInTaskList(task('Draft'))).toBeFalse();
    expect(otherTab.error).toContain('another tab');
    expect(otherTab.reloadTasks()).toBeTrue();
    expect(otherTab.addTaskInTaskList(task('Draft'))).toBeTrue();
    expect(otherTab.allTasks.length).toBe(2);
  });
});
