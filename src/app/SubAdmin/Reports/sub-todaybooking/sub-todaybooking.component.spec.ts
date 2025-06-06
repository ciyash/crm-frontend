import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTodaybookingComponent } from './sub-todaybooking.component';

describe('SubTodaybookingComponent', () => {
  let component: SubTodaybookingComponent;
  let fixture: ComponentFixture<SubTodaybookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubTodaybookingComponent]
    });
    fixture = TestBed.createComponent(SubTodaybookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
