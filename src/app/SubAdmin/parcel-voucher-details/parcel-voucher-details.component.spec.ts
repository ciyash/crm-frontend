import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelVoucherDetailsComponent } from './parcel-voucher-details.component';

describe('ParcelVoucherDetailsComponent', () => {
  let component: ParcelVoucherDetailsComponent;
  let fixture: ComponentFixture<ParcelVoucherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelVoucherDetailsComponent]
    });
    fixture = TestBed.createComponent(ParcelVoucherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
