import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopayReportComponent } from './topay-report.component';

describe('TopayReportComponent', () => {
  let component: TopayReportComponent;
  let fixture: ComponentFixture<TopayReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopayReportComponent]
    });
    fixture = TestBed.createComponent(TopayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
