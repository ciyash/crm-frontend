import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelBranchComponent } from './parcel-branch.component';

describe('ParcelBranchComponent', () => {
  let component: ParcelBranchComponent;
  let fixture: ComponentFixture<ParcelBranchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelBranchComponent]
    });
    fixture = TestBed.createComponent(ParcelBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
