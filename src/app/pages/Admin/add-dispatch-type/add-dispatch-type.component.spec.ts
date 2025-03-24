import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDispatchTypeComponent } from './add-dispatch-type.component';

describe('AddDispatchTypeComponent', () => {
  let component: AddDispatchTypeComponent;
  let fixture: ComponentFixture<AddDispatchTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDispatchTypeComponent]
    });
    fixture = TestBed.createComponent(AddDispatchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
