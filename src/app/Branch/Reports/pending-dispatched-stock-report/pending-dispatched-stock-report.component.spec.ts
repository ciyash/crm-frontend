import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDispatchedStockReportComponent } from './pending-dispatched-stock-report.component';

describe('PendingDispatchedStockReportComponent', () => {
  let component: PendingDispatchedStockReportComponent;
  let fixture: ComponentFixture<PendingDispatchedStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingDispatchedStockReportComponent]
    });
    fixture = TestBed.createComponent(PendingDispatchedStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
