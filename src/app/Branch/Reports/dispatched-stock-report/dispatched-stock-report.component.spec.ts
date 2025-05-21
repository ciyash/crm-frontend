import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedStockReportComponent } from './dispatched-stock-report.component';

describe('DispatchedStockReportComponent', () => {
  let component: DispatchedStockReportComponent;
  let fixture: ComponentFixture<DispatchedStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchedStockReportComponent]
    });
    fixture = TestBed.createComponent(DispatchedStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
