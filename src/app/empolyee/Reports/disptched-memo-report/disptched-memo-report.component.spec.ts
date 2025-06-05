import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisptchedMemoReportComponent } from './disptched-memo-report.component';

describe('DisptchedMemoReportComponent', () => {
  let component: DisptchedMemoReportComponent;
  let fixture: ComponentFixture<DisptchedMemoReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisptchedMemoReportComponent]
    });
    fixture = TestBed.createComponent(DisptchedMemoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
