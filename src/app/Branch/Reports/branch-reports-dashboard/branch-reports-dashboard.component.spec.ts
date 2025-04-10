import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchReportsDashboardComponent } from './branch-reports-dashboard.component';

describe('BranchReportsDashboardComponent', () => {
  let component: BranchReportsDashboardComponent;
  let fixture: ComponentFixture<BranchReportsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchReportsDashboardComponent]
    });
    fixture = TestBed.createComponent(BranchReportsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
