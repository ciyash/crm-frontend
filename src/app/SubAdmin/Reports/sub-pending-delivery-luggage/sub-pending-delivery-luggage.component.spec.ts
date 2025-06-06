import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPendingDeliveryLuggageComponent } from './sub-pending-delivery-luggage.component';

describe('SubPendingDeliveryLuggageComponent', () => {
  let component: SubPendingDeliveryLuggageComponent;
  let fixture: ComponentFixture<SubPendingDeliveryLuggageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubPendingDeliveryLuggageComponent]
    });
    fixture = TestBed.createComponent(SubPendingDeliveryLuggageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
