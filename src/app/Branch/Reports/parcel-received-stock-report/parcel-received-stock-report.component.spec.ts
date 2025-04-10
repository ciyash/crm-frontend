import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelReceivedStockReportComponent } from './parcel-received-stock-report.component';

describe('ParcelReceivedStockReportComponent', () => {
  let component: ParcelReceivedStockReportComponent;
  let fixture: ComponentFixture<ParcelReceivedStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelReceivedStockReportComponent]
    });
    fixture = TestBed.createComponent(ParcelReceivedStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
