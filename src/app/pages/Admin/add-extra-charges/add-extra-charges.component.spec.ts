import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExtraChargesComponent } from './add-extra-charges.component';

describe('AddExtraChargesComponent', () => {
  let component: AddExtraChargesComponent;
  let fixture: ComponentFixture<AddExtraChargesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddExtraChargesComponent]
    });
    fixture = TestBed.createComponent(AddExtraChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
