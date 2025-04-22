import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstDataComponent } from './gst-data.component';

describe('GstDataComponent', () => {
  let component: GstDataComponent;
  let fixture: ComponentFixture<GstDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GstDataComponent]
    });
    fixture = TestBed.createComponent(GstDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
