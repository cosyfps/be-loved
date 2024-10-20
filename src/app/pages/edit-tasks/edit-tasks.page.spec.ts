import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTasksPage } from './edit-tasks.page';

describe('EditTasksPage', () => {
  let component: EditTasksPage;
  let fixture: ComponentFixture<EditTasksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
