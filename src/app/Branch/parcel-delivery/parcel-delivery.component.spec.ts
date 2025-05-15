import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelDeliveryComponent } from './parcel-delivery.component';

describe('ParcelDeliveryComponent', () => {
  let component: ParcelDeliveryComponent;
  let fixture: ComponentFixture<ParcelDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelDeliveryComponent]
    });
    fixture = TestBed.createComponent(ParcelDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
