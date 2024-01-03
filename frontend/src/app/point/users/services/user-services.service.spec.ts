import { TestBed } from '@angular/core/testing';

import { UserServices } from './user.service';

describe('UserServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserServices = TestBed.get(UserServices);
    expect(service).toBeTruthy();
  });
});
