import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedReportComponent } from './dispatched-report.component';

describe('DispatchedReportComponent', () => {
  let component: DispatchedReportComponent;
  let fixture: ComponentFixture<DispatchedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchedReportComponent]
    });
    fixture = TestBed.createComponent(DispatchedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
