# Crossroads Okta Angular Library

Crds-okta-auth will enable your product to:

- authenticate through okta
- check authentication status
- protect routes
- append access tokens to requests to predefined origins

## Installing

### Install via NPM with

```bash
npm install --save @crds_npm/crds-okta-auth
```

### Build the config json and add crds-okta-auth module as a dependency

```typescript
import {
  CrdsOktaAuthModule,
  CRDSOktaConfig,
  AuthenticatedGuard,
  CRDSTokenInjectorInterceptor
} from '@crds_npm/crds-okta-auth';

const authConfig: CRDSOktaConfig = {
  oktaBase: {
    url: 'INSERT URL',
    clientId: 'INSERT CLIENT ID',
    redirectUri: 'URL TO REDIRECT TO AFTER AUTHENTICATION',
    idps: [{ type: 'FACEBOOK', id: 'FACEBOOK IDP ID' }, { type: 'GOOGLE', id: 'GOOGLE IDP ID' }]
  },
  tokenInjectorDomains: ['ARRAY OF DOMAINS TO APPEND TOKEN INTO HEADER ON REQUESTS'],
  logging: true
};

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    CrdsOktaAuthModule.forRoot(authConfig)
    ...
  ],
  providers: [
    ...
    { provide: HTTP_INTERCEPTORS, useClass: CRDSTokenInjectorInterceptor, multi: true }
    ...
    ]
})
```

## API

---

### Table of Contents

| Modules                                   | Services                                                | Interceptors                                                  | Guards                                    | Directives                                              | Classes                               |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| [CrdsOktaAuthModule](#CrdsOktaAuthModule) | [CrdsAuthenticationService](#CrdsAuthenticationService) | [CrdsTokenInjectorInterceptor](#CrdsTokenInjectorInterceptor) | [AuthenticatedGuard](#AuthenticatedGuard) | [CRDSSignInWidgetDirective](#CRDSSignInWidgetDirective) | [CRDSOktaConfig](#CRDSOktaConfig)      |
| &nbsp;                                    | [CrdsSigninService](#CrdsSigninService)                 | &nbsp;                                                        | [CanLoginGuard](#CanLoginGuard)           | &nbsp;                                                  | [CRDSTokens\ICRDSTokens](#CRDSTokens) |

### Documentation

---

#### ***`CrdsOktaAuthModule`***

---

> Base angular module for providing CRDS-OKTA-AUTH for your application.

**`function`: forRoot(config: CRDSOktaConfig): ModuleWithProviders**

> Requires an instance of [`CRDSOktaConfig`](#CRDSOktaConfig) to instantiate.  Provided in the `import` section of your Core Module.

```typescript
import { CrdsOktaAuthModule, CRDSOktaConfig} from '@crds_npm/crds-okta-auth';

const authConfig: CRDSOktaConfig = {...};

@NgModule({
  declarations: [...],
  imports: [CrdsOktaAuthModule.forRoot(authConfig)
    ...
  ],
  providers: [...]
})
```

---

#### ***`CrdsAuthenticationService`***

---

>Basic service used to interact with Okta Auth Status

**`function`: authenticated(): Observable\<[CRDSTokens](#CRDSTokens)\>**

>Returns an observable that contains either the tokens for the user (if logged in), or null if not logged in.  This function will check the (local) token manager first to see if there is a session, and if there is no local session, it will check the server for an active session, and set it in the (local) token manager if one exists. 

```typescript
  authenticated().subscribe((tokens: CRDSTokens) => {
    if (tokens != null) {
      console.log('user logged in', tokens);
    } else {
      console.log('user is NOT logged in');
    }
  }
```

**`function`: signOut(): Observable\<boolean\>**

> Returns an observable that contains whether the signout action was successful or not.

```typescript
    signOut().subscribe(success => {
      if (success) {
        console.log('log out worked')
      } else {
        console.log('log out failed')
      }
    });
```

---

#### ***`CrdsSigninService`***

---

>Used to implement a custom signin page.  If using the [CRDSSignInWidgetDirective](#CRDSSignInWidgetDirective) to implement the standard crds-signin-page, this is NOT needed.  Most applications will not need to use this service.

**`function`: runSigninFlow(): Observable\<boolean\>**

>Returns an observable of boolean indicating if the user is logged in.  Sets the Redirect URL in the cookie if the user IS NOT logged in, allowing the signin page to redirect the user after login.  This function is built to be called from a route guard.  
>  
>under the hood:
>1. get tokens from url if they exist
>2. if tokens exist, add them to the manager and return true (authenticated)
>3. if tokens do not exist, check with okta to see if there is an active session
>4. if there is an active session and the user just activated their account, do some mp stuff
>5. if the session is not active, set the redirect url in the cookie

```typescript
runSigninFlow().pipe(
  tap(isAuthenticated => {
    if (isAuthenticated) {
      redirectToOriginUrl();
    }
  })
);
```

**`function`: getSigninWidget([overrideParams](https://github.com/okta/okta-signin-widget#configuration)): [OktaSigninWidget](https://github.com/okta/okta-signin-widget#oktasignin)**

>Returns an instance of the [OktaSigninWidget](https://github.com/okta/okta-signin-widget#oktasignin).  The base config used to instantiate the auth module has enough details to generate this on its own, but the config is able to be overwritten using the [OktaSigninWidget Config](https://github.com/okta/okta-signin-widget#configuration) options.

```typescript
const configOverride = {...}

const signInWidget = getSignInWidget(configOverride);
```

**`function`: redirectToOriginUrl(): void**

>redirects the user to the value stored in the redirect_url cookie if it exists.  If the redirect_url cookie does not exist, redirects to www.crossroads.net

---

#### ***`CrdsTokenInjectorInterceptor`***

---

> This interceptor is used to automatically inject the `access_token` into requests made using the angular http_client module.  An array of target domains must be specified in the [CRDSOktaConfig](#CRDSOktaConfig) passed to the forRoot function of the [CrdsOktaAuthModule](#CrdsOktaAuthModule).  This ensures that the okta access_token is not passed erroneously to third party api's.

**`Class`: CRDSTokenInjectorInterceptor**

>This interceptor is provided in the `providers` array of the core angular module.

```typescript
import { CRDSTokenInjectorInterceptor, CrdsOktaAuthModule, CRDSOktaConfig} from '@crds_npm/crds-okta-auth';

const authConfig: CRDSOktaConfig = {
  ...
  tokenInjectorDomains: ['api.crossroads.net', 'someotherplace.crossroads.net']
  ...
};

@NgModule({
  declarations: [...],
  imports: [
    ...
    CrdsOktaAuthModule.forRoot(authConfig)
    ...
  ],
  providers: [
    ...,
    { provide: HTTP_INTERCEPTORS, useClass: CRDSTokenInjectorInterceptor, multi: true },
    ...
  ]
})
```

---

#### ***`AuthenticatedGuard`***

---

> Enables Angular routes to be locked down, requiring the user to be authenticated before accessing them.

```typescript
import { AuthenticatedGuard } from '@crds_npm/crds-okta-auth';

const routes: Routes = [
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthenticatedGuard]
  },

@NgModule({
  declarations: [...],
  imports: [
    ...
    RouterModule.forRoot(routes),
    ...
  ],
  providers: [...]
})
```

---

#### ***`CanLoginGuard`***

---

> Enables a route for a login page to be protected and only accessible if the user IS NOT logged in.  If the user IS logged in, it will redirect them to the value stored in the `redirect_url` cookie.  This guard runs the full crds okta sign-in flow and checks the server for a session if a local one does not exist.

```typescript
import { CanLoginGuard } from '@crds_npm/crds-okta-auth';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [CanLoginGuard]
  },


@NgModule({
  declarations: [...],
  imports: [
    ...
    RouterModule.forRoot(routes),
    ...
  ],
  providers: [...]
})
```

---

#### ***`CRDSSignInWidgetDirective`***

---

> Enables an empty div to be turned into an okta signin form.  Can be overwritten using [OktaSigninWidget Config](https://github.com/okta/okta-signin-widget#configuration).  
>
> using default config

```typescript
@Component({
  selector: 'app-login',
  template: `<div crdsSignInWidget></div>`
})
export class LoginComponent {}
```

> overriding default config

```typescript
@Component({
  selector: 'app-login',
  template: `<div [crdsSignInWidget]="config"></div>`
})
export class LoginComponent {
  public config = {
    logo: 'some_img.jpeg'
  }
}
```

---

#### ***`CRDSOktaConfig`***

---

>Interface for OktaConfig Options.  Get these from the system administrator.  Make sure they are not commited to github and are coming from the environment.ts files as a part of the build process.  

```typescript
{
  oktaBase: {
    url: string; `The base URL for the Okta Crossroads organization`
    clientId: string; `Client Id pre-registered with Okta`
    redirectUri: string; `The url that is redirected to after authentication. This must be pre-registered`
    idps: { type: string; id: string }[]; `A list of identity providers and their corresponding IDs`
  };
  tokenInjectorDomains: string[]; `Requests made to these domains will have the users access_token included in the headers by` [CrdsTokenInjectorInterceptor](#CrdsTokenInjectorInterceptor)
  logging: boolean; `Enables logging for the CRDS-OKTA-AUTH library -- should be off in prod`
}
```

```typescript
// example
var config: OktaBaseConfig = {
  oktaBase: {
    url: 'https://acme.okta.com',
    clientId: '12lk3j1l23kj1l2k3',
    redirectUri: 'http://www.acme.com',
    idps: [
      { type: 'google'; id: 'adsdasdasd' },
      { type: 'facebook'; id: 'acsdvasdv' }
    ]
  },
  tokenInjectorDomains: ['api.acme.com', 'someotherapi.com'],
  logging: true
}
```

---

#### ***`CRDSTokens`***

---

> Interface and class for containing tokens.

```typescript
{
  access_token: string; `okta access_token`
  id_token: string; `okta id_token`
}
```

---

## Contributing

> These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on npm.

### Building

> - `npm i`
> - `npm run build` - this will run a build and will watch to rebuild when changes happen

### Running the tests

> - `npm run test`

### Deployment

> To deploy to npm:
>
> - Get invited to the Crossroads NPM account
> - [login to npm](https://docs.npmjs.com/logging-in-to-an-npm-enterprise-registry-from-the-command-line) from the command line
> - increment the version # in the package.json according to semver
> - build the library
> - navigate to ./dist/libs/crds-okta-auth and run `npm publish --access=public`

### Run Locally

> - [checkout `npm link`](https://docs.npmjs.com/cli/link.html)

## Author

> *Doug Shannon* - _Initial work_ - [Doug-Shannon](https://github.com/Doug-Shannon)

