import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConslidatedReportComponent } from './conslidated-report.component';

describe('ConslidatedReportComponent', () => {
  let component: ConslidatedReportComponent;
  let fixture: ComponentFixture<ConslidatedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConslidatedReportComponent]
    });
    fixture = TestBed.createComponent(ConslidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
