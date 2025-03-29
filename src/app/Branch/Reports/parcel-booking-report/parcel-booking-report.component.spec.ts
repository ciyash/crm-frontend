import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelBookingReportComponent } from './parcel-booking-report.component';

describe('ParcelBookingReportComponent', () => {
  let component: ParcelBookingReportComponent;
  let fixture: ComponentFixture<ParcelBookingReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelBookingReportComponent]
    });
    fixture = TestBed.createComponent(ParcelBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
