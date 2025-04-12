import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelCancelComponent } from './parcel-cancel.component';

describe('ParcelCancelComponent', () => {
  let component: ParcelCancelComponent;
  let fixture: ComponentFixture<ParcelCancelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelCancelComponent]
    });
    fixture = TestBed.createComponent(ParcelCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
