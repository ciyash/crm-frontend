import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCfmasterComponent } from './add-cfmaster.component';

describe('AddCfmasterComponent', () => {
  let component: AddCfmasterComponent;
  let fixture: ComponentFixture<AddCfmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCfmasterComponent]
    });
    fixture = TestBed.createComponent(AddCfmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
