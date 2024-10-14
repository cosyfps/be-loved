import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisreservasPage } from './misreservas.page';

describe('MisreservasPage', () => {
  let component: MisreservasPage;
  let fixture: ComponentFixture<MisreservasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisreservasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
