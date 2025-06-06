import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIncomingLuggageComponent } from './sub-incoming-luggage.component';

describe('SubIncomingLuggageComponent', () => {
  let component: SubIncomingLuggageComponent;
  let fixture: ComponentFixture<SubIncomingLuggageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubIncomingLuggageComponent]
    });
    fixture = TestBed.createComponent(SubIncomingLuggageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
