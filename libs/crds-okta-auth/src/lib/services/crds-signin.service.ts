import { LoggerService } from './logger.service';
import { CookieService } from 'ngx-cookie-service';
import { tap, map, switchMap, catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';

import * as OktaSignIn from '@okta/okta-signin-widget';

import { OktaService } from '../provider/okta.service';
import { OktaWidgetConfigService } from '../provider/okta-widget-config.service';

@Injectable()
export class CrdsSigninService {
  constructor(
    @Inject(OktaService) private okta,
    @Inject(OktaWidgetConfigService) private config,
    private cookies: CookieService,
    private log: LoggerService
  ) {}

  /**
   * Runs the okta authentication flow -
   * 1 get tokens from url if they exist
   * 2 if tokens exist, add them to the manager and return true (authenticated)
   * 3 if tokens do not exist, check with okta to see if there is an active session
   * 4 if there is an active session and the user just activated their account, do some mp stuff
   * 5 if the session is not active, set the redirect url in the cookie
   */
  public runSigninFlow(): Observable<boolean> {
    return this.getTokensFromUrl().pipe(
      switchMap(token => {
        if (!!token) {
          this.addTokensToManager(token);
          return of(true);
        } else {
          return this.handleIfActiveSession().pipe(tap(isActive => (!isActive ? this.setRedirectUrl() : null)));
        }
      }),
      catchError(err => {
        this.log.Error('SIGNIN SERVICE: error in signin flow', err)
        return of(false);
      })
    );
  }

  /**
   * Gets the Okta sign-in-widget
   *
   * @param overrideParams: Okta sign-in-widget configuration options to override the default
   */
  public getSignInWidget(overrideParams): any {
    return new OktaSignIn({ ...this.config, ...overrideParams });
  }

  /**
   * Redirects to the origin url stored in the cookie.
   * If redirect_url doesn't exist, redirects to www.crossroads.net
   *
   */
  public redirectToOriginUrl(): void {
    const redirect_url = this.cookies.get('redirect_url');
    this.cookies.delete('redirect_url');

    this.windowLocationReplace(redirect_url || 'https://www.crossroads.net');
  }

  /**
   * sets the current redirect_url cookie to expire in one day
   * and erases the current url in the browser history
   */
  private setRedirectUrl(): void {
    const redirect_url = this.getUrlParam('redirect_url');
    if (redirect_url) {
      this.cookies.set('redirect_url', redirect_url, 1);
    }

    window.history.replaceState(null, null, window.location.pathname);
  }

  /**
   * Adds access tokens to the okta token manager
   */
  private addTokensToManager([idToken, accessToken]): void {
    this.okta.tokenManager.add('id_token', idToken);
    this.okta.tokenManager.add('access_token', accessToken);
  }

  /**
   * Checks if there is an active session
   */
  private getIfActiveSession(): Observable<boolean> {
    return from(this.okta.session.get()).pipe(map((res: any) => res.status === 'ACTIVE'));
  }

  /**
   * Checks if the current user just registered
   */
  private isAccountActivation(): boolean {
    return this.getUrlParam('type_hint') === 'ACTIVATION';
  }

  /**
   * Gets tokens from the url string
   * if there are no tokens, returns null
   */
  private getTokensFromUrl(): Observable<any> {
    return from(this.okta.token.parseFromUrl()).pipe(catchError(err => of(null)));
  }

  /**
   * Checks for an active session (will eventually) save to mp if its a new account
   */
  private handleIfActiveSession(): Observable<boolean> {
    return this.getIfActiveSession().pipe(
      switchMap(isActive => {
        if (isActive) {
          return from(
            this.okta.token.getWithoutPrompt({
              scopes: ['openid', 'profile', 'email'],
              responseType: ['id_token', 'token']
            })
          ).pipe(
            tap((tokens: any) => this.addTokensToManager(tokens)),
            map(tokens => !!tokens)
          );
        } else {
          return of(false);
        }
      }),
      tap(isActive => {
        if (isActive && this.isAccountActivation()) {
          // do mp account activation stuff
          // probably turns this tap into a switchmap
        }
      })
    );
  }

  private getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  private windowLocationReplace(url: string) {
    window.location.replace(url);
  }
}
