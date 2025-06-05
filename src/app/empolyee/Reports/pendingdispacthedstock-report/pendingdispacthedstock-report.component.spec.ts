import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingdispacthedstockReportComponent } from './pendingdispacthedstock-report.component';

describe('PendingdispacthedstockReportComponent', () => {
  let component: PendingdispacthedstockReportComponent;
  let fixture: ComponentFixture<PendingdispacthedstockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingdispacthedstockReportComponent]
    });
    fixture = TestBed.createComponent(PendingdispacthedstockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
