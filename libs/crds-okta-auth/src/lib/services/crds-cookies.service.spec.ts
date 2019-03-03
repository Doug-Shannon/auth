import { TestBed } from '@angular/core/testing';

import { CrdsCookiesService } from './crds-cookies.service';

describe('CrdsCookiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrdsCookiesService = TestBed.get(CrdsCookiesService);
    expect(service).toBeTruthy();
  });
});
