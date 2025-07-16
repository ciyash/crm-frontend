import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchwiseBookingdetailsComponent } from './branchwise-bookingdetails.component';

describe('BranchwiseBookingdetailsComponent', () => {
  let component: BranchwiseBookingdetailsComponent;
  let fixture: ComponentFixture<BranchwiseBookingdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchwiseBookingdetailsComponent]
    });
    fixture = TestBed.createComponent(BranchwiseBookingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
