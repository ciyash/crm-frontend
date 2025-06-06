import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDispatchedStockComponent } from './sub-dispatched-stock.component';

describe('SubDispatchedStockComponent', () => {
  let component: SubDispatchedStockComponent;
  let fixture: ComponentFixture<SubDispatchedStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubDispatchedStockComponent]
    });
    fixture = TestBed.createComponent(SubDispatchedStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
