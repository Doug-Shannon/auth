import { LoggerService } from './../services/logger.service';
import { CrdsAuthenticationService } from '../services/crds-authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private crdsAuthenticated: CrdsAuthenticationService, private log: LoggerService) {}
  canActivate(): Observable<boolean> {
    return this.crdsAuthenticated.authenticated().pipe(
      map(tokens => !!tokens),
      catchError(err => {
        this.log.Error('AUTHENTICATED GUARD: error trying to authenticate', err);
        return of(false);
      })
    );
  }
}
