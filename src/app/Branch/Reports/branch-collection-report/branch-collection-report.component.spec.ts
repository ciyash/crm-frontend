import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCollectionReportComponent } from './branch-collection-report.component';

describe('BranchCollectionReportComponent', () => {
  let component: BranchCollectionReportComponent;
  let fixture: ComponentFixture<BranchCollectionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchCollectionReportComponent]
    });
    fixture = TestBed.createComponent(BranchCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
