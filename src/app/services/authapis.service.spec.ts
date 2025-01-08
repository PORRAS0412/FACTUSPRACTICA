import { TestBed } from '@angular/core/testing';

import { AuthapisService } from './authapis.service';

describe('AuthapisService', () => {
  let service: AuthapisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthapisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
