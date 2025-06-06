import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubStatusDateDifferentComponent } from './sub-status-date-different.component';

describe('SubStatusDateDifferentComponent', () => {
  let component: SubStatusDateDifferentComponent;
  let fixture: ComponentFixture<SubStatusDateDifferentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubStatusDateDifferentComponent]
    });
    fixture = TestBed.createComponent(SubStatusDateDifferentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
