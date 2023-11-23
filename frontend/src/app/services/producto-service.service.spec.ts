import { TestBed } from '@angular/core/testing';

import { ProductoServiceService } from './producto-service.service';

describe('ProductoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductoServiceService = TestBed.get(ProductoServiceService);
    expect(service).toBeTruthy();
  });
});
