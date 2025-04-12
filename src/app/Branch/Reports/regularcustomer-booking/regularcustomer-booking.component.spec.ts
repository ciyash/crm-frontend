import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularcustomerBookingComponent } from './regularcustomer-booking.component';

describe('RegularcustomerBookingComponent', () => {
  let component: RegularcustomerBookingComponent;
  let fixture: ComponentFixture<RegularcustomerBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularcustomerBookingComponent]
    });
    fixture = TestBed.createComponent(RegularcustomerBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
