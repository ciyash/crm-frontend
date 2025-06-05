import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingdevliveryLuggagereportComponent } from './pendingdevlivery-luggagereport.component';

describe('PendingdevliveryLuggagereportComponent', () => {
  let component: PendingdevliveryLuggagereportComponent;
  let fixture: ComponentFixture<PendingdevliveryLuggagereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingdevliveryLuggagereportComponent]
    });
    fixture = TestBed.createComponent(PendingdevliveryLuggagereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
