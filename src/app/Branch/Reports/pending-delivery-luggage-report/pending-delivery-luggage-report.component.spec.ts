import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDeliveryLuggageReportComponent } from './pending-delivery-luggage-report.component';

describe('PendingDeliveryLuggageReportComponent', () => {
  let component: PendingDeliveryLuggageReportComponent;
  let fixture: ComponentFixture<PendingDeliveryLuggageReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingDeliveryLuggageReportComponent]
    });
    fixture = TestBed.createComponent(PendingDeliveryLuggageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
