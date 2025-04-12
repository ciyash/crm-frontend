import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedMemoReportComponent } from './dispatched-memo-report.component';

describe('DispatchedMemoReportComponent', () => {
  let component: DispatchedMemoReportComponent;
  let fixture: ComponentFixture<DispatchedMemoReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchedMemoReportComponent]
    });
    fixture = TestBed.createComponent(DispatchedMemoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
