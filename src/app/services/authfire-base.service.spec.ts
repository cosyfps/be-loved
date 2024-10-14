import { TestBed } from '@angular/core/testing';

import { AuthfireBaseService } from './authfire-base.service';

describe('AuthfireBaseService', () => {
  let service: AuthfireBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthfireBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
