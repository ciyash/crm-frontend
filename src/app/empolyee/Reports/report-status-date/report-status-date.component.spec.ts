import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStatusDateComponent } from './report-status-date.component';

describe('ReportStatusDateComponent', () => {
  let component: ReportStatusDateComponent;
  let fixture: ComponentFixture<ReportStatusDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportStatusDateComponent]
    });
    fixture = TestBed.createComponent(ReportStatusDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
