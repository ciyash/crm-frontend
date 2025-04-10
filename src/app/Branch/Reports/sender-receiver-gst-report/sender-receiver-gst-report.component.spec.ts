import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderReceiverGstReportComponent } from './sender-receiver-gst-report.component';

describe('SenderReceiverGstReportComponent', () => {
  let component: SenderReceiverGstReportComponent;
  let fixture: ComponentFixture<SenderReceiverGstReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SenderReceiverGstReportComponent]
    });
    fixture = TestBed.createComponent(SenderReceiverGstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
