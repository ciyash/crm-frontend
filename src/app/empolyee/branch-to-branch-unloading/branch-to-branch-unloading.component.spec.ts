import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchToBranchUnloadingComponent } from './branch-to-branch-unloading.component';

describe('BranchToBranchUnloadingComponent', () => {
  let component: BranchToBranchUnloadingComponent;
  let fixture: ComponentFixture<BranchToBranchUnloadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchToBranchUnloadingComponent]
    });
    fixture = TestBed.createComponent(BranchToBranchUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
