import { async, TestBed } from '@angular/core/testing';
import { CrdsOktaAuthModule } from './crds-okta-auth.module';

describe('CrdsOktaAuthModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CrdsOktaAuthModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CrdsOktaAuthModule).toBeDefined();
  });
});
