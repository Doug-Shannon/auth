import { LoggingStatus } from './provider/logging-status.provider';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as OktaAuth from '@okta/okta-auth-js';

import { OktaWidgetConfigService } from './provider/okta-widget-config.service';
import { OktaService } from './provider/okta.service';
import { CanLoginGuard } from './guards/can-login.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { CRDSSignInWidgetDirective } from './directives/sign-in-widget.directive';
import { CrdsSigninService } from './services/crds-signin.service';
import { CrdsAuthenticationService } from './services/crds-authentication.service';
import { CRDSTokenInjectorInterceptor } from './interceptors/crds-token-injector.interceptor';
import { TokenInjectorDomains } from './provider/token-injector-domains.provider';
import { CRDSOktaConfig } from './models/crds-okta-config.model';
import { CookieService } from 'ngx-cookie-service';

export { CanLoginGuard } from './guards/can-login.guard';
export { AuthenticatedGuard } from './guards/authenticated.guard';
export { CrdsAuthenticationService } from './services/crds-authentication.service';
export { CrdsSigninService } from './services/crds-signin.service';
export { CRDSTokenInjectorInterceptor } from './interceptors/crds-token-injector.interceptor';
export { CRDSOktaConfig } from './models/crds-okta-config.model';
export { CRDSTokens } from './models/crds-token.models';

/**
 * base config used for the sign in widget
 */
const signInWidetBaseConfig = {
  features: {
    registration: true,
    selfServiceUnlock: true
  },
  authParams: {
    issuer: 'default',
    responseType: ['id_token', 'token'],
    display: 'page',
    scopes: ['openid', 'profile', 'email']
  },
  i18n: {
    en: {
      'primaryauth.username.placeholder': 'Email',
      'registration.signup.label': 'New to Crossroads?',
      'registration.signup.text': 'Create an account.'
    }
  }
};

/**
 * base config used for the okta auth service
 */
const authBaseConfig = {
  issuer: 'default',

  // TokenManager config
  tokenManager: {
    storage: 'localStorage'
  }
};

alert('IT FRICKIN WORKED again! 44')

@NgModule({
  imports: [CommonModule],
  declarations: [CRDSSignInWidgetDirective],
  exports: [CRDSSignInWidgetDirective]
})
export class CrdsOktaAuthModule {
  static forRoot(config: CRDSOktaConfig): ModuleWithProviders {
    return {
      ngModule: CrdsOktaAuthModule,
      providers: [
        CanLoginGuard,
        AuthenticatedGuard,
        CrdsSigninService,
        CRDSTokenInjectorInterceptor,
        CrdsAuthenticationService,
        {
          provide: OktaWidgetConfigService,
          useValue: {
            ...signInWidetBaseConfig,
            ...config.oktaBase,
            baseUrl: config.oktaBase.url
          }
        },
        {
          provide: OktaService,
          useValue: new OktaAuth({ ...authBaseConfig, ...config.oktaBase })
        },
        {
          provide: TokenInjectorDomains,
          useValue: [...config.tokenInjectorDomains]
        },
        {
          provide: LoggingStatus,
          useValue: config.logging
        },
        CookieService
      ]
    };
  }
}
