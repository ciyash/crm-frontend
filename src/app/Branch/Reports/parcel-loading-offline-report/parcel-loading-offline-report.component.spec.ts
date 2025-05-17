import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelLoadingOfflineReportComponent } from './parcel-loading-offline-report.component';

describe('ParcelLoadingOfflineReportComponent', () => {
  let component: ParcelLoadingOfflineReportComponent;
  let fixture: ComponentFixture<ParcelLoadingOfflineReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelLoadingOfflineReportComponent]
    });
    fixture = TestBed.createComponent(ParcelLoadingOfflineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
