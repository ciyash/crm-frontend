import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfmasterDataComponent } from './cfmaster-data.component';

describe('CfmasterDataComponent', () => {
  let component: CfmasterDataComponent;
  let fixture: ComponentFixture<CfmasterDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CfmasterDataComponent]
    });
    fixture = TestBed.createComponent(CfmasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
