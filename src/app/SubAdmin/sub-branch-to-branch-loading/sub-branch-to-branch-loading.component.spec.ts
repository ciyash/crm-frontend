import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBranchToBranchLoadingComponent } from './sub-branch-to-branch-loading.component';

describe('SubBranchToBranchLoadingComponent', () => {
  let component: SubBranchToBranchLoadingComponent;
  let fixture: ComponentFixture<SubBranchToBranchLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubBranchToBranchLoadingComponent]
    });
    fixture = TestBed.createComponent(SubBranchToBranchLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
