import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailUsersPage } from './detail-users.page';

describe('DetailUsersPage', () => {
  let component: DetailUsersPage;
  let fixture: ComponentFixture<DetailUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
