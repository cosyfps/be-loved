import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactocliPage } from './contactocli.page';

describe('ContactocliPage', () => {
  let component: ContactocliPage;
  let fixture: ComponentFixture<ContactocliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactocliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
