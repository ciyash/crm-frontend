import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedstockReportComponent } from './dispatchedstock-report.component';

describe('DispatchedstockReportComponent', () => {
  let component: DispatchedstockReportComponent;
  let fixture: ComponentFixture<DispatchedstockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispatchedstockReportComponent]
    });
    fixture = TestBed.createComponent(DispatchedstockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
