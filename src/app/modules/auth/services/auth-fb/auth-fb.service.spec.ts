import { TestBed } from '@angular/core/testing';

import { AuthFbService } from './auth-fb.service';

describe('AuthFbService', () => {
  let service: AuthFbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
