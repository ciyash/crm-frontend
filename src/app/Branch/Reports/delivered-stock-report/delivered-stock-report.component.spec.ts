import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredStockReportComponent } from './delivered-stock-report.component';

describe('DeliveredStockReportComponent', () => {
  let component: DeliveredStockReportComponent;
  let fixture: ComponentFixture<DeliveredStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveredStockReportComponent]
    });
    fixture = TestBed.createComponent(DeliveredStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
