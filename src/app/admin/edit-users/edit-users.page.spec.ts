import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUsersPage } from './edit-users.page';

describe('EditUsersPage', () => {
  let component: EditUsersPage;
  let fixture: ComponentFixture<EditUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
