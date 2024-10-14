import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarmesaPage } from './agregarmesa.page';

describe('AgregarmesaPage', () => {
  let component: AgregarmesaPage;
  let fixture: ComponentFixture<AgregarmesaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarmesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
