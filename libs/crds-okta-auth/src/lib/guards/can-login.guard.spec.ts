import { CrdsSigninService } from './../services/crds-signin.service';
import { TestBed, inject } from '@angular/core/testing';

import { CanLoginGuard } from './can-login.guard';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { LoggerService } from '../services/logger.service';

describe('CanLoginGuard', () => {
  let mockSigninService, mockLoggerService;
  beforeEach(() => {
    mockSigninService = jasmine.createSpyObj<CrdsSigninService>('signin', ['runSigninFlow', 'redirectToOriginUrl']);
    mockLoggerService = jasmine.createSpyObj<LoggerService>('log', ['Error']);

    TestBed.configureTestingModule({
      providers: [
        CanLoginGuard,
        { provide: CrdsSigninService, useValue: mockSigninService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    });
  });

  it('should not canlogin and redirect to origin if authenticated', inject([CanLoginGuard], (guard: CanLoginGuard) => {
    mockSigninService.runSigninFlow.and.returnValue(cold('--x', { x: true }));
    const res$ = guard.canActivate();
    getTestScheduler().flush();
    res$.subscribe(res => {
      expect(res).toBe(false);
      expect(mockSigninService.redirectToOriginUrl).toHaveBeenCalled();
      expect(mockLoggerService.Error).not.toHaveBeenCalled();
    });
  }));

  it('should canlogin if not authenticated', inject([CanLoginGuard], (guard: CanLoginGuard) => {
    mockSigninService.runSigninFlow.and.returnValue(cold('--x', { x: false }));
    const res$ = guard.canActivate();
    getTestScheduler().flush();
    res$.subscribe(res => {
      expect(res).toBe(true);
      expect(mockSigninService.redirectToOriginUrl).not.toHaveBeenCalled();
      expect(mockLoggerService.Error).not.toHaveBeenCalled();
    });
  }));

  it('should canlogin if error is thrown', inject([CanLoginGuard], (guard: CanLoginGuard) => {
    mockSigninService.runSigninFlow.and.returnValue(cold('--#|', { x: true }));
    const res$ = guard.canActivate();
    getTestScheduler().flush();
    res$.subscribe(res => {
      expect(res).toBe(false);
      expect(mockSigninService.redirectToOriginUrl).not.toHaveBeenCalled();
      expect(mockLoggerService.Error).toHaveBeenCalled();
    });
  }));
});
