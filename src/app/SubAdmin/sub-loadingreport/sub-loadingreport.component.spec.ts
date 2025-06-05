import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLoadingreportComponent } from './sub-loadingreport.component';

describe('SubLoadingreportComponent', () => {
  let component: SubLoadingreportComponent;
  let fixture: ComponentFixture<SubLoadingreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubLoadingreportComponent]
    });
    fixture = TestBed.createComponent(SubLoadingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
