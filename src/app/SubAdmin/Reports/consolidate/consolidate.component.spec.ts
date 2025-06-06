import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidateComponent } from './consolidate.component';

describe('ConsolidateComponent', () => {
  let component: ConsolidateComponent;
  let fixture: ComponentFixture<ConsolidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsolidateComponent]
    });
    fixture = TestBed.createComponent(ConsolidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
