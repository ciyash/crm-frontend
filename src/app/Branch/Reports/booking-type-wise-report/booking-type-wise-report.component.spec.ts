import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTypeWiseReportComponent } from './booking-type-wise-report.component';

describe('BookingTypeWiseReportComponent', () => {
  let component: BookingTypeWiseReportComponent;
  let fixture: ComponentFixture<BookingTypeWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTypeWiseReportComponent]
    });
    fixture = TestBed.createComponent(BookingTypeWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
