import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDeliveryStockReportComponent } from './pending-delivery-stock-report.component';

describe('PendingDeliveryStockReportComponent', () => {
  let component: PendingDeliveryStockReportComponent;
  let fixture: ComponentFixture<PendingDeliveryStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingDeliveryStockReportComponent]
    });
    fixture = TestBed.createComponent(PendingDeliveryStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
