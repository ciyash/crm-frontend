import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelLoadingDataComponent } from './parcel-loading-data.component';

describe('ParcelLoadingDataComponent', () => {
  let component: ParcelLoadingDataComponent;
  let fixture: ComponentFixture<ParcelLoadingDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelLoadingDataComponent]
    });
    fixture = TestBed.createComponent(ParcelLoadingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
