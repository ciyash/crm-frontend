import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrachToBranchUnloadingComponent } from './brach-to-branch-unloading.component';

describe('BrachToBranchUnloadingComponent', () => {
  let component: BrachToBranchUnloadingComponent;
  let fixture: ComponentFixture<BrachToBranchUnloadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrachToBranchUnloadingComponent]
    });
    fixture = TestBed.createComponent(BrachToBranchUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
