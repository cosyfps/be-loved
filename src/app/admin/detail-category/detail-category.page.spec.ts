import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCategoryPage } from './detail-category.page';

describe('DetailCategoryPage', () => {
  let component: DetailCategoryPage;
  let fixture: ComponentFixture<DetailCategoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
