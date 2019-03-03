import { CrdsSigninService } from '../services/crds-signin.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CanLoginGuard implements CanActivate {
  constructor(private crdsSignin: CrdsSigninService, private log: LoggerService) {}
  canActivate(): Observable<boolean> {
    return this.crdsSignin.runSigninFlow().pipe(
      tap(isAuthenticated => {
        if (isAuthenticated) {
          this.crdsSignin.redirectToOriginUrl();
        }
      }),
      map(authenticated => !authenticated),
      catchError(err => {
        this.log.Error('AUTHENTICATED GUARD: error trying to authenticate', err);
        return of(false);
      })
    );
  }
}
