import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBranchToBranchUnloadingComponent } from './sub-branch-to-branch-unloading.component';

describe('SubBranchToBranchUnloadingComponent', () => {
  let component: SubBranchToBranchUnloadingComponent;
  let fixture: ComponentFixture<SubBranchToBranchUnloadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubBranchToBranchUnloadingComponent]
    });
    fixture = TestBed.createComponent(SubBranchToBranchUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
