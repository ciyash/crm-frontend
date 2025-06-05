import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBookingComponent } from './sub-booking.component';

describe('SubBookingComponent', () => {
  let component: SubBookingComponent;
  let fixture: ComponentFixture<SubBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubBookingComponent]
    });
    fixture = TestBed.createComponent(SubBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
