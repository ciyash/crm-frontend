import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelloadingComponent } from './parcelloading.component';

describe('ParcelloadingComponent', () => {
  let component: ParcelloadingComponent;
  let fixture: ComponentFixture<ParcelloadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelloadingComponent]
    });
    fixture = TestBed.createComponent(ParcelloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
