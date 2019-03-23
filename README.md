# Crossroads Okta Angular Library

Crds-okta-auth will enable your product to:

- authenticate through okta
- check authentication status
- protect routes
- append access tokens to requests to predefined origins

<!-- ## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
``` -->

## Installing

---

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
    fromUri: 'URL TO REDIRECT TO AFTER AUTHENTICATION',
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

[Modules](#Modules)                       | [Services](#Services)                                   | [Interceptors](#Interceptors)                                 | [Guards](#Guards)                         | [Directives](#Directives)                               | [Classes](#Classes)
---                                       | ---                                                     | ---                                                           | ---                                       | ---                                                     | ---
[CrdsOktaAuthModule](#CrdsOktaAuthModule) | [CrdsAuthenticationService](#CrdsAuthenticationService) | [CrdsTokenInjectorInterceptor](#CrdsTokenInjectorInterceptor) | [AuthenticatedGuard](#AuthenticatedGuard) | [CRDSSignInWidgetDirective](#CRDSSignInWidgetDirective) | [CRDSOktaConfig](CRDSOktaConfig)
&nbsp;                                    | [CrdsSigninService](#CrdsSigninService)                 |            &nbsp;                                             | [CanLoginGuard](#CanLoginGuard)           |                      &nbsp;                             | [CRDSTokens\ICRDSTokens](#CRDSTokens)

### Documentation

---

#### Modules

---

##### ***`CrdsOktaAuthModule`***

>`function`: forRoot(config: CRDSOktaConfig): ModuleWithProviders

Base angular module for providing CRDS-OKTA-AUTH for your application.  Requires an instance of [`CRDSOktaConfig`](CRDSOktaConfig) to instantiate.  Provided in the `import` section of your Core Module.

example:

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

#### Services

---

##### ***`CrdsAuthenticationService`***

##### ***`CrdsSigninService`***

---

#### Interceptors

---

##### ***`CrdsTokenInjectorInterceptor`***

---

#### Guards

---

##### ***`AuthenticatedGuard`***

##### ***`CanLoginGuard`***

---

#### Directives

---

##### ***`CRDSSignInWidgetDirective`***

---

#### Classes

---

##### ***`CRDSOktaConfig`***

##### ***`CRDSTokens`***

## Running the tests

Explain how to run the automated tests for this system

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

- [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
- [Maven](https://maven.apache.org/) - Dependency Management
- [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Billie Thompson** - _Initial work_ - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
