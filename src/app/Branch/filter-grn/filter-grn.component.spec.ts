import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGrnComponent } from './filter-grn.component';

describe('FilterGrnComponent', () => {
  let component: FilterGrnComponent;
  let fixture: ComponentFixture<FilterGrnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterGrnComponent]
    });
    fixture = TestBed.createComponent(FilterGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
