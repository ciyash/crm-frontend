import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelbookingSerialnoComponent } from './parcelbooking-serialno.component';

describe('ParcelbookingSerialnoComponent', () => {
  let component: ParcelbookingSerialnoComponent;
  let fixture: ComponentFixture<ParcelbookingSerialnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelbookingSerialnoComponent]
    });
    fixture = TestBed.createComponent(ParcelbookingSerialnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
