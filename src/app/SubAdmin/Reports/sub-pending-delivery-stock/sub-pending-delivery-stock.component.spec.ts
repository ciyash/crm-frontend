import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPendingDeliveryStockComponent } from './sub-pending-delivery-stock.component';

describe('SubPendingDeliveryStockComponent', () => {
  let component: SubPendingDeliveryStockComponent;
  let fixture: ComponentFixture<SubPendingDeliveryStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubPendingDeliveryStockComponent]
    });
    fixture = TestBed.createComponent(SubPendingDeliveryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
