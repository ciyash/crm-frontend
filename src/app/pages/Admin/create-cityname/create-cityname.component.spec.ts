import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCitynameComponent } from './create-cityname.component';

describe('CreateCitynameComponent', () => {
  let component: CreateCitynameComponent;
  let fixture: ComponentFixture<CreateCitynameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCitynameComponent]
    });
    fixture = TestBed.createComponent(CreateCitynameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
