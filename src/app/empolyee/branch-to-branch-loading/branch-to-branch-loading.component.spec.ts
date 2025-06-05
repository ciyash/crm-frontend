import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchToBranchLoadingComponent } from './branch-to-branch-loading.component';

describe('BranchToBranchLoadingComponent', () => {
  let component: BranchToBranchLoadingComponent;
  let fixture: ComponentFixture<BranchToBranchLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchToBranchLoadingComponent]
    });
    fixture = TestBed.createComponent(BranchToBranchLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
