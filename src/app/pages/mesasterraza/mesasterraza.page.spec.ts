import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesasterrazaPage } from './mesasterraza.page';

describe('MesasterrazaPage', () => {
  let component: MesasterrazaPage;
  let fixture: ComponentFixture<MesasterrazaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesasterrazaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
