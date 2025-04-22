import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedComponent } from './consolidated.component';

describe('ConsolidatedComponent', () => {
  let component: ConsolidatedComponent;
  let fixture: ComponentFixture<ConsolidatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsolidatedComponent]
    });
    fixture = TestBed.createComponent(ConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
