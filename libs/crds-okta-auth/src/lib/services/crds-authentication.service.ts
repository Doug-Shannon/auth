import { LoggerService } from './logger.service';
import { OktaService } from '../provider/okta.service';
import { Injectable, Inject } from '@angular/core';
import { Observable, from, of, forkJoin, Subject } from 'rxjs';
import { map, switchMap, first, tap, catchError } from 'rxjs/operators';
import { CRDSTokens } from '../models/crds-token.models';
@Injectable()
export class CrdsAuthenticationService {
  constructor(@Inject(OktaService) private okta, private log: LoggerService) {}

  public authenticated(): Observable<CRDSTokens> {
    return this.getTokenDictionary().pipe(
      switchMap(tokens => {
        if (!!tokens) {
          return of(tokens);
        } else {
          return this.getTokensFromSession();
        }
      })
    );
  }

  public signOut(): Observable<boolean> {
    return from(this.okta.signOut()).pipe(
      map(() => {
        this.okta.tokenManager.clear();
        this.log.Log('successfully logged out');
        return true;
      }),
      catchError(err => {
        this.log.Error('AUTHENTICATION SERICE: okta signout function returned error', err);
        return of(null);
      })
    );
  }

  private getTokenDictionary(): Observable<CRDSTokens> {
    const idToken = from(this.okta.tokenManager.get('access_token'));
    const accessToken$ = from(this.okta.tokenManager.get('id_token'));
    return forkJoin([idToken, accessToken$]).pipe(
      first(),
      map(([id, access]) => {
        if (!!id && !!access) {
          return CRDSTokens.From({ id_token: id, access_token: access });
        } else {
          return null;
        }
      }),
      catchError(err => {
        this.log.Error('AUTHENTICATION SERICE: okta tokenManager get function returned error', err);
        return of(null);
      })
    );
  }

  private getTokensFromSession() {
    return from(this.okta.session.exists()).pipe(
      first(),
      switchMap(exists => {
        if (exists) {
          return from(
            this.okta.token.getWithoutPrompt({
              scopes: ['openid', 'profile', 'email'],
              responseType: ['id_token', 'token']
            })
          ).pipe(
            first(),
            tap((tokens: any) => {
              this.okta.tokenManager.add('id_token', tokens[1]);
              this.okta.tokenManager.add('access_token', tokens[0]);
            }),
            map(tokens => {
              return CRDSTokens.From({ access_token: tokens[0], id_token: tokens[1] });
            }),
            catchError(err => {
              this.log.Error('AUTHENTICATION SERICE: okta get without prompt function returned error', err);
              return of(null);
            })
          );
        } else {
          return of(null);
        }
      }),
      catchError(err => {
        this.log.Error('AUTHENTICATION SERICE: okta session exists function returned error', err);
        return of(null);
      })
    );
  }
}
