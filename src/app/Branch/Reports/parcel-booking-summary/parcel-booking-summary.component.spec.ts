import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelBookingSummaryComponent } from './parcel-booking-summary.component';

describe('ParcelBookingSummaryComponent', () => {
  let component: ParcelBookingSummaryComponent;
  let fixture: ComponentFixture<ParcelBookingSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelBookingSummaryComponent]
    });
    fixture = TestBed.createComponent(ParcelBookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
