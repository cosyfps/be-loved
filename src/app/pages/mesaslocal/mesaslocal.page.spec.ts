import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesaslocalPage } from './mesaslocal.page';

describe('MesaslocalPage', () => {
  let component: MesaslocalPage;
  let fixture: ComponentFixture<MesaslocalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaslocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
