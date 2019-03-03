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

export { CanLoginGuard } from './guards/can-login.guard';
export { AuthenticatedGuard } from './guards/authenticated.guard';
export { CrdsAuthenticationService } from './services/crds-authentication.service';
export { CrdsSigninService } from './services/crds-signin.service';
export { CRDSTokenInjectorInterceptor } from './interceptors/crds-token-injector.interceptor';

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

/**
 * Interface that consuming applications will use to instantiate this package
 */
export interface CRDSOktaConfig {
  oktaBase: {
    url: string;
    clientId: string;
    redirectUri: string;
    fromUri: string;
    idps: { type: string; id: string }[];
  };
  tokenInjectorDomains: string[];
  logging: boolean;
}

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
        }
      ]
    };
  }
}
