import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucerOfflineListComponent } from './voucer-offline-list.component';

describe('VoucerOfflineListComponent', () => {
  let component: VoucerOfflineListComponent;
  let fixture: ComponentFixture<VoucerOfflineListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucerOfflineListComponent]
    });
    fixture = TestBed.createComponent(VoucerOfflineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
