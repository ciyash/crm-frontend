import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDateReportComponent } from './status-date-report.component';

describe('StatusDateReportComponent', () => {
  let component: StatusDateReportComponent;
  let fixture: ComponentFixture<StatusDateReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusDateReportComponent]
    });
    fixture = TestBed.createComponent(StatusDateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
