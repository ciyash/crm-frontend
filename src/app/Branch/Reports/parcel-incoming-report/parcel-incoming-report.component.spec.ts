import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelIncomingReportComponent } from './parcel-incoming-report.component';

describe('ParcelIncomingReportComponent', () => {
  let component: ParcelIncomingReportComponent;
  let fixture: ComponentFixture<ParcelIncomingReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelIncomingReportComponent]
    });
    fixture = TestBed.createComponent(ParcelIncomingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
