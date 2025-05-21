import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeliveryComponent } from './report-delivery.component';

describe('ReportDeliveryComponent', () => {
  let component: ReportDeliveryComponent;
  let fixture: ComponentFixture<ReportDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDeliveryComponent]
    });
    fixture = TestBed.createComponent(ReportDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
