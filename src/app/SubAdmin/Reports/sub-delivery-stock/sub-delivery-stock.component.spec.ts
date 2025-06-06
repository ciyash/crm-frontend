import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDeliveryStockComponent } from './sub-delivery-stock.component';

describe('SubDeliveryStockComponent', () => {
  let component: SubDeliveryStockComponent;
  let fixture: ComponentFixture<SubDeliveryStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubDeliveryStockComponent]
    });
    fixture = TestBed.createComponent(SubDeliveryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
