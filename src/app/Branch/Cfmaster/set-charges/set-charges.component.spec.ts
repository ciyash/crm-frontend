import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetChargesComponent } from './set-charges.component';

describe('SetChargesComponent', () => {
  let component: SetChargesComponent;
  let fixture: ComponentFixture<SetChargesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetChargesComponent]
    });
    fixture = TestBed.createComponent(SetChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
