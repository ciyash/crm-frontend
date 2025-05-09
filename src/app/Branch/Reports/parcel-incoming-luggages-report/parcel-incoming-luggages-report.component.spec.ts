import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelIncomingLuggagesReportComponent } from './parcel-incoming-luggages-report.component';

describe('ParcelIncomingLuggagesReportComponent', () => {
  let component: ParcelIncomingLuggagesReportComponent;
  let fixture: ComponentFixture<ParcelIncomingLuggagesReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelIncomingLuggagesReportComponent]
    });
    fixture = TestBed.createComponent(ParcelIncomingLuggagesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
