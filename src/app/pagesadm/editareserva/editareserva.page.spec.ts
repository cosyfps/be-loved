import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditareservaPage } from './editareserva.page';

describe('EditareservaPage', () => {
  let component: EditareservaPage;
  let fixture: ComponentFixture<EditareservaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditareservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
