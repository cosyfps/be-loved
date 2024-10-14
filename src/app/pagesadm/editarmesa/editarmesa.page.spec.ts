import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarmesaPage } from './editarmesa.page';

describe('EditarmesaPage', () => {
  let component: EditarmesaPage;
  let fixture: ComponentFixture<EditarmesaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarmesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
