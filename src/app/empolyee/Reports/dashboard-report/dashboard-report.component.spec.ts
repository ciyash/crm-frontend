import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReportComponent } from './dashboard-report.component';

describe('DashboardReportComponent', () => {
  let component: DashboardReportComponent;
  let fixture: ComponentFixture<DashboardReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardReportComponent]
    });
    fixture = TestBed.createComponent(DashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
