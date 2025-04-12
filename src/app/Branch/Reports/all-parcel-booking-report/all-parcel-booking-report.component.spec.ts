import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllParcelBookingReportComponent } from './all-parcel-booking-report.component';

describe('AllParcelBookingReportComponent', () => {
  let component: AllParcelBookingReportComponent;
  let fixture: ComponentFixture<AllParcelBookingReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllParcelBookingReportComponent]
    });
    fixture = TestBed.createComponent(AllParcelBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
