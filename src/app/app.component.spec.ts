import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TaskService } from './task-page/task.service';

describe('Task screen browser flows', () => {
  let fixture: ComponentFixture<AppComponent>;
  let service: TaskService;
  let store: Record<string, string>;
  beforeEach(async () => {
    store = {};
    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => store[key] ?? null);
    spyOn(Storage.prototype, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
    await TestBed.configureTestingModule({ imports: [AppModule, NoopAnimationsModule] }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    service = TestBed.inject(TaskService);
    fixture.detectChanges();
    await fixture.whenStable();
  });
  async function addTask(name: string, status = 'To Do', description: string | null = 'Regression test details') {
    fixture.nativeElement.querySelector('.add-task-button').click();
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await (await loader.getHarness(MatInputHarness.with({ selector: '[name="name"]' }))).setValue(name);
    if (description !== null) { await (await loader.getHarness(MatInputHarness.with({ selector: '[name="description"]' }))).setValue(description); }
    await (await loader.getHarness(MatInputHarness.with({ selector: '[name="dueDate"]' }))).setValue('1/1/2030');
    await (await loader.getHarness(MatSelectHarness.with({ selector: '[name="priority"]' }))).clickOptions({ text: 'High' });
    await (await loader.getHarness(MatSelectHarness.with({ selector: '[name="status"]' }))).clickOptions({ text: status });
    fixture.detectChanges();
    const submit = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submit.disabled).toBeFalse();
    submit.click();
    fixture.detectChanges();
    await fixture.whenStable();
  }
  it('renders an empty state and allows keyboard filtering', () => {
    expect(fixture.nativeElement.textContent).toContain('No tasks in this view');
    const completed = fixture.nativeElement.querySelectorAll('.nav-item')[3] as HTMLElement;
    completed.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(completed.getAttribute('aria-pressed')).toBe('true');
  });
  it('creates, filters, completes, reopens, edits and deletes isolated tasks', async () => {
    await addTask('Regression first');
    await addTask('Regression second', 'In Progress');
    expect(fixture.nativeElement.querySelectorAll('app-task').length).toBe(2);
    let row = fixture.nativeElement.querySelector('app-task') as HTMLElement;
    (row.querySelector('[aria-label="Complete task"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.allTasks[0].status).toBe('Completed');
    row = fixture.nativeElement.querySelector('app-task') as HTMLElement;
    (row.querySelector('[aria-label="Reopen task"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.allTasks[0].status).toBe('To Do');
    (fixture.nativeElement.querySelectorAll('.nav-item')[2] as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-task').length).toBe(1);
    expect(fixture.nativeElement.querySelector('app-task').textContent).toContain('Regression second');
    (fixture.nativeElement.querySelectorAll('.nav-item')[0] as HTMLElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[aria-label="Edit task"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await (await loader.getHarness(MatInputHarness.with({ selector: '[name="name"]' }))).setValue('Regression edited');
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(service.allTasks.map(task => task.name)).toEqual(['Regression edited', 'Regression second']);
    (fixture.nativeElement.querySelector('[aria-label="Delete task"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.allTasks.map(task => task.name)).toEqual(['Regression second']);
    expect(new TaskService().allTasks[0].name).toBe('Regression second');
  });
  it('allows an untouched optional description', async () => {
    await addTask('Optional description', 'To Do', null);
    expect(service.allTasks.length).toBe(1);
    expect(new TaskService().allTasks[0].description).toBeUndefined();
  });
  it('keeps the draft visible and reports a failed save', async () => {
    (Storage.prototype.setItem as jasmine.Spy).and.throwError('Storage unavailable');
    await addTask('Regression unsaved');
    expect(service.allTasks.length).toBe(0);
    expect(fixture.nativeElement.querySelector('input[name="name"]').value).toBe('Regression unsaved');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('could not be saved');
  });
});
