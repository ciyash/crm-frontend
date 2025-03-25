import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoucherslistDataComponent } from './print-voucherslist-data.component';

describe('PrintVoucherslistDataComponent', () => {
  let component: PrintVoucherslistDataComponent;
  let fixture: ComponentFixture<PrintVoucherslistDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintVoucherslistDataComponent]
    });
    fixture = TestBed.createComponent(PrintVoucherslistDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
