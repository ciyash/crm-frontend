import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubReceivedStockComponent } from './sub-received-stock.component';

describe('SubReceivedStockComponent', () => {
  let component: SubReceivedStockComponent;
  let fixture: ComponentFixture<SubReceivedStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubReceivedStockComponent]
    });
    fixture = TestBed.createComponent(SubReceivedStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
