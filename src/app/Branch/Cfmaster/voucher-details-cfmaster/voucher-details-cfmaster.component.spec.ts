import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDetailsCfmasterComponent } from './voucher-details-cfmaster.component';

describe('VoucherDetailsCfmasterComponent', () => {
  let component: VoucherDetailsCfmasterComponent;
  let fixture: ComponentFixture<VoucherDetailsCfmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherDetailsCfmasterComponent]
    });
    fixture = TestBed.createComponent(VoucherDetailsCfmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
