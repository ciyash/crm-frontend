import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelStatusDateDifferentComponent } from './parcel-status-date-different.component';

describe('ParcelStatusDateDifferentComponent', () => {
  let component: ParcelStatusDateDifferentComponent;
  let fixture: ComponentFixture<ParcelStatusDateDifferentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelStatusDateDifferentComponent]
    });
    fixture = TestBed.createComponent(ParcelStatusDateDifferentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
