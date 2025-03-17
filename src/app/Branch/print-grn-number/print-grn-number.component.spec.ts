import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintGrnNumberComponent } from './print-grn-number.component';

describe('PrintGrnNumberComponent', () => {
  let component: PrintGrnNumberComponent;
  let fixture: ComponentFixture<PrintGrnNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintGrnNumberComponent]
    });
    fixture = TestBed.createComponent(PrintGrnNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
