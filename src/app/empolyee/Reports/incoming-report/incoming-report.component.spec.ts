import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingReportComponent } from './incoming-report.component';

describe('IncomingReportComponent', () => {
  let component: IncomingReportComponent;
  let fixture: ComponentFixture<IncomingReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomingReportComponent]
    });
    fixture = TestBed.createComponent(IncomingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
