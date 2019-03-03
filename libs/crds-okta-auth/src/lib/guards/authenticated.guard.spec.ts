import { LoggerService } from './../services/logger.service';
import { CrdsAuthenticationService } from './../services/crds-authentication.service';
import { TestBed, inject } from '@angular/core/testing';

import { cold, getTestScheduler } from 'jasmine-marbles';
import { AuthenticatedGuard } from './authenticated.guard';

fdescribe('AuthenticatedGuard', () => {
  let mockAuthenticationService, mockLoggerService;
  beforeEach(() => {
    mockAuthenticationService = jasmine.createSpyObj<CrdsAuthenticationService>('signin', ['authenticated']);
    mockLoggerService = jasmine.createSpyObj<LoggerService>('log', ['Error']);
    TestBed.configureTestingModule({
      providers: [
        AuthenticatedGuard,
        { provide: CrdsAuthenticationService, useValue: mockAuthenticationService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    });
  });

  it('should return true, tokens exist', inject([AuthenticatedGuard], (guard: AuthenticatedGuard) => {
    mockAuthenticationService.authenticated.and.returnValue(cold('--x', { x: { accesstoken: 'abc' } }));
    const res$ = guard.canActivate();
    getTestScheduler().flush();
    res$.subscribe(res => {
      expect(mockLoggerService.Error).not.toHaveBeenCalled();
      expect(res).toBe(true);
    });
  }));

  it('should return false, tokens do not exist', inject([AuthenticatedGuard], (guard: AuthenticatedGuard) => {
    mockAuthenticationService.authenticated.and.returnValue(cold('--x', { x: null }));
    const res$ = guard.canActivate();
    getTestScheduler().flush();
    res$.subscribe(res => {
      expect(mockLoggerService.Error).not.toHaveBeenCalled();
      expect(res).toBe(false);
    });
  }));

  it('should return false, error in authentication', inject([AuthenticatedGuard], (guard: AuthenticatedGuard) => {
    mockAuthenticationService.authenticated.and.returnValue(cold('--#'));
    const res$ = guard.canActivate();
    getTestScheduler().flush();
    res$.subscribe(res => {
      expect(mockLoggerService.Error).toHaveBeenCalled();
      expect(res).toBe(false);
    });
  }));
});
