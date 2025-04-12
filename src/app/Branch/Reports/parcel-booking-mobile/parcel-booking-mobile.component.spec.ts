import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelBookingMobileComponent } from './parcel-booking-mobile.component';

describe('ParcelBookingMobileComponent', () => {
  let component: ParcelBookingMobileComponent;
  let fixture: ComponentFixture<ParcelBookingMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelBookingMobileComponent]
    });
    fixture = TestBed.createComponent(ParcelBookingMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
