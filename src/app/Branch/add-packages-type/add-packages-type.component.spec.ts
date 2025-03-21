import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPackagesTypeComponent } from './add-packages-type.component';

describe('AddPackagesTypeComponent', () => {
  let component: AddPackagesTypeComponent;
  let fixture: ComponentFixture<AddPackagesTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPackagesTypeComponent]
    });
    fixture = TestBed.createComponent(AddPackagesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
