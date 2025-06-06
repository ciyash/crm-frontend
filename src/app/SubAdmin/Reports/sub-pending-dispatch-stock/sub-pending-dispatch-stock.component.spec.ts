import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPendingDispatchStockComponent } from './sub-pending-dispatch-stock.component';

describe('SubPendingDispatchStockComponent', () => {
  let component: SubPendingDispatchStockComponent;
  let fixture: ComponentFixture<SubPendingDispatchStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubPendingDispatchStockComponent]
    });
    fixture = TestBed.createComponent(SubPendingDispatchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
