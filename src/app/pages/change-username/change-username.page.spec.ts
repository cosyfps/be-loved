import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeUsernamePage } from './change-username.page';

describe('ChangeUsernamePage', () => {
  let component: ChangeUsernamePage;
  let fixture: ComponentFixture<ChangeUsernamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
