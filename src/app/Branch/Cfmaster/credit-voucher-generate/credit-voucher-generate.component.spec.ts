import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditVoucherGenerateComponent } from './credit-voucher-generate.component';

describe('CreditVoucherGenerateComponent', () => {
  let component: CreditVoucherGenerateComponent;
  let fixture: ComponentFixture<CreditVoucherGenerateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditVoucherGenerateComponent]
    });
    fixture = TestBed.createComponent(CreditVoucherGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
