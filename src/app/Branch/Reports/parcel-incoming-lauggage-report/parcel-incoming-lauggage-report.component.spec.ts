import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelIncomingLauggageReportComponent } from './parcel-incoming-lauggage-report.component';

describe('ParcelIncomingLauggageReportComponent', () => {
  let component: ParcelIncomingLauggageReportComponent;
  let fixture: ComponentFixture<ParcelIncomingLauggageReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelIncomingLauggageReportComponent]
    });
    fixture = TestBed.createComponent(ParcelIncomingLauggageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
