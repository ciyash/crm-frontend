import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMemoDispatchedComponent } from './sub-memo-dispatched.component';

describe('SubMemoDispatchedComponent', () => {
  let component: SubMemoDispatchedComponent;
  let fixture: ComponentFixture<SubMemoDispatchedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubMemoDispatchedComponent]
    });
    fixture = TestBed.createComponent(SubMemoDispatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
