import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelbookingComponent } from './parcelbooking.component';

describe('ParcelbookingComponent', () => {
  let component: ParcelbookingComponent;
  let fixture: ComponentFixture<ParcelbookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelbookingComponent]
    });
    fixture = TestBed.createComponent(ParcelbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
