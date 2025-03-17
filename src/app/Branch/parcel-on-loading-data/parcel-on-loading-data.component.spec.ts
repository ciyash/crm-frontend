import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelOnLoadingDataComponent } from './parcel-on-loading-data.component';

describe('ParcelOnLoadingDataComponent', () => {
  let component: ParcelOnLoadingDataComponent;
  let fixture: ComponentFixture<ParcelOnLoadingDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelOnLoadingDataComponent]
    });
    fixture = TestBed.createComponent(ParcelOnLoadingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
