import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryStockReportComponent } from './delivery-stock-report.component';

describe('DeliveryStockReportComponent', () => {
  let component: DeliveryStockReportComponent;
  let fixture: ComponentFixture<DeliveryStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryStockReportComponent]
    });
    fixture = TestBed.createComponent(DeliveryStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
