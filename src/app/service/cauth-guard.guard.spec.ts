import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cauthGuardGuard } from './cauth-guard.guard';

describe('cauthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cauthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
