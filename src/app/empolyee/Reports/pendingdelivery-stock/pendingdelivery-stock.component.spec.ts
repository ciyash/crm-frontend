import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingdeliveryStockComponent } from './pendingdelivery-stock.component';

describe('PendingdeliveryStockComponent', () => {
  let component: PendingdeliveryStockComponent;
  let fixture: ComponentFixture<PendingdeliveryStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingdeliveryStockComponent]
    });
    fixture = TestBed.createComponent(PendingdeliveryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
