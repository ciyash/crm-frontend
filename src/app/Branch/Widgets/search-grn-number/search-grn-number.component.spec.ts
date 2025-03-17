import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGrnNumberComponent } from './search-grn-number.component';

describe('SearchGrnNumberComponent', () => {
  let component: SearchGrnNumberComponent;
  let fixture: ComponentFixture<SearchGrnNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchGrnNumberComponent]
    });
    fixture = TestBed.createComponent(SearchGrnNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
