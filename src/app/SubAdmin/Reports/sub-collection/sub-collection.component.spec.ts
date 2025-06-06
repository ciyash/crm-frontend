import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCollectionComponent } from './sub-collection.component';

describe('SubCollectionComponent', () => {
  let component: SubCollectionComponent;
  let fixture: ComponentFixture<SubCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubCollectionComponent]
    });
    fixture = TestBed.createComponent(SubCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
