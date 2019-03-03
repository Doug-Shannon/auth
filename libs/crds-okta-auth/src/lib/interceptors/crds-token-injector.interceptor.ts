import { LoggerService } from '../services/logger.service';
import { CrdsAuthenticationService } from '../services/crds-authentication.service';

import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, flatMap, first, catchError } from 'rxjs/operators';
import { TokenInjectorDomains } from '../provider/token-injector-domains.provider';

@Injectable()
export class CRDSTokenInjectorInterceptor implements HttpInterceptor {
  constructor(
    private authService: CrdsAuthenticationService,
    @Inject(TokenInjectorDomains) private domains: string[],
    private log: LoggerService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.authenticated().pipe(
      first(),
      flatMap(tokens => {
        try {
          let outgoingReq: HttpRequest<any> = request;

          // if user is logged in
          if (!!tokens && tokens['access_token'] && tokens['access_token']['accessToken']) {
            // if the request is being made to a specified domain, insert the authorization header
            if (this.isToProvidedDomains(this.domains, request)) {
              outgoingReq = request.clone({
                headers: request.headers.set('Authorization', tokens['access_token']['accessToken'])
              });
              this.log.Info('INTERCEPTOR: headers appended to request');
            } else {
              this.log.Info('INTERCEPTOR: this request was not from a provided domain, req not touched');
            }
          } else {
            this.log.Info('INTERCEPTOR: not logged in or tokens are missing, not attaching headers');
          }
          this.log.Info('INTERCEPTOR: outgoing request', outgoingReq);
          return next.handle(outgoingReq);
        } catch {
          this.log.Error('INTERCEPTOR: error processing request, sending original', request);
          return next.handle(request);
        }
      }),
      catchError(err => {
        this.log.Error('INTERCEPTOR: error getting tokens, sending original request', request);
        return next.handle(request);
      })
    );
  }

  private isToProvidedDomains(domains: string[], request: HttpRequest<any>): boolean {
    // https://stackoverflow.com/questions/25703360/regular-expression-extract-subdomain-domain
    const domainMatch = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gi;

    const found = !!domains.find(d => {
      const match = domainMatch.exec(request.url);
      if (match && match.length > 0) {
        const matchingPortion = match[0];
        if (matchingPortion != null) {
          return matchingPortion.includes(d);
        }
      }

      return false;
    });

    return found;
  }
}
