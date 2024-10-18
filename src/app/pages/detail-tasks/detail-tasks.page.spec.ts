import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailTasksPage } from './detail-tasks.page';

describe('DetailTasksPage', () => {
  let component: DetailTasksPage;
  let fixture: ComponentFixture<DetailTasksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
