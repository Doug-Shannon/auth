import { CrdsAuthenticationService } from './../services/crds-authentication.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CRDSTokenInjectorInterceptor } from './crds-token-injector.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { LoggerService } from './../services/logger.service';
import { TokenInjectorDomains } from '../provider/token-injector-domains.provider';
import { Injectable } from '@angular/core';
import { cold, getTestScheduler } from 'jasmine-marbles';

@Injectable()
export class ExampleDataService {
  MATCHING_DOMAIN = `crossroads.net`;
  NOT_MATCHING_DOMAIN = `notmatching.net`;

  constructor(private http: HttpClient) {}

  getSomethingMatchingDomain() {
    return this.http.get(`${this.MATCHING_DOMAIN}/something`);
  }

  getSomethingNotMatchingDomain() {
    return this.http.get(`${this.NOT_MATCHING_DOMAIN}/something`);
  }
}

fdescribe(`AuthHttpInterceptor`, () => {
  let httpMock: HttpTestingController;
  let dataService: ExampleDataService;
  const mockAuthService = jasmine.createSpyObj<CrdsAuthenticationService>('auth', ['authenticated']);
  const mockLogger = jasmine.createSpyObj<LoggerService>('log', ['Info', 'Error']);
  const domains = ['crossroads.net', 'someotherdomain.com'];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExampleDataService,
        { provide: CrdsAuthenticationService, useValue: mockAuthService },
        { provide: LoggerService, useValue: mockLogger },
        {
          provide: TokenInjectorDomains,
          useValue: [...domains]
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CRDSTokenInjectorInterceptor,
          multi: true
        }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    dataService = TestBed.get(ExampleDataService);
  });

  it('should add an Authorization header, tokens exist, to matching domain', () => {
    // spyOn(this.isToProvidedDomains)
    mockAuthService.authenticated.and.returnValue(cold('----x', { x: { access_token: { accessToken: 'thetoken' } } }));
    dataService.getSomethingMatchingDomain().subscribe(response => {
      expect(response).toBeTruthy();
    });

    getTestScheduler().flush();

    const httpRequest = httpMock.expectOne(`${dataService.MATCHING_DOMAIN}/something`);
    httpRequest.flush(['abc', 'def']);

    expect(mockAuthService.authenticated).toHaveBeenCalled();
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
  });

  it('should not an Authorization header, tokens exist, not matching domain', () => {
    // spyOn(this.isToProvidedDomains)
    mockAuthService.authenticated.and.returnValue(cold('----x', { x: { access_token: { accessToken: 'thetoken' } } }));
    dataService.getSomethingNotMatchingDomain().subscribe(response => {
      expect(response).toBeTruthy();
    });

    getTestScheduler().flush();

    const httpRequest = httpMock.expectOne(`${dataService.NOT_MATCHING_DOMAIN}/something`);
    httpRequest.flush(['abc', 'def']);

    expect(mockAuthService.authenticated).toHaveBeenCalled();
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

  it('should not add an Authorization header, no tokens exist, to matching domain', () => {
    // spyOn(this.isToProvidedDomains)
    mockAuthService.authenticated.and.returnValue(cold('----x', { x: {} }));
    dataService.getSomethingMatchingDomain().subscribe(response => {
      expect(response).toBeTruthy();
    });

    getTestScheduler().flush();

    const httpRequest = httpMock.expectOne(`${dataService.MATCHING_DOMAIN}/something`);
    httpRequest.flush(['abc', 'def']);
    expect(mockAuthService.authenticated).toHaveBeenCalled();
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

  it('should not add an Authorization header on authentication service error', () => {
    // spyOn(this.isToProvidedDomains)
    mockAuthService.authenticated.and.returnValue(cold('----#', { x: {} }));
    dataService.getSomethingMatchingDomain().subscribe(response => {
      expect(response).toBeTruthy();
    });

    getTestScheduler().flush();

    const httpRequest = httpMock.expectOne(`${dataService.MATCHING_DOMAIN}/something`);
    httpRequest.flush(['abc', 'def']);
    expect(mockAuthService.authenticated).toHaveBeenCalled();
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });
});
