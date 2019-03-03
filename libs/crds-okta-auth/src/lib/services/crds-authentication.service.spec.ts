import { CrdsAuthenticationService } from './crds-authentication.service';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { of } from 'rxjs';
import { CRDSTokens } from '../models/crds-token.models';

describe('CrdsAuthenticationService', () => {
  let mokta, mockLoggerService;
  beforeEach(() => {
    mockLoggerService = jasmine.createSpyObj<LoggerService>('log', ['Log', 'Error']);
    mokta = jasmine.createSpyObj('okta', ['signOut']);

    mokta.session = jasmine.createSpyObj('session', ['exists']);
    mokta.token = jasmine.createSpyObj('token', ['getWithoutPrompt']);
    mokta.tokenManager = jasmine.createSpyObj('tokenManager', ['add', 'get', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CrdsAuthenticationService,
          useFactory: () => new CrdsAuthenticationService(mokta, mockLoggerService),
          multi: false,
          deps: []
        }
      ]
    });
  });

  it('should be created', inject([CrdsAuthenticationService], (service: CrdsAuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  describe('Authenticated Tests', () => {
    it(
      'tokens in dictionary, session exists, should return tokens',
      fakeAsync(
        inject([CrdsAuthenticationService], (service: CrdsAuthenticationService) => {
          mokta.tokenManager.get.and.returnValues(Promise.resolve('token2'), Promise.resolve('token1'));
          let tokens;
          service.authenticated().subscribe(t => {
            tokens = t;
          });
          tick(15000);
          expect(tokens).toEqual(CRDSTokens.From({ access_token: 'token1', id_token: 'token2' }));
          expect(mokta.session.exists).not.toHaveBeenCalled();
          expect(mokta.tokenManager.get).toHaveBeenCalled();
        })
      )
    );

    it(
      'tokens not in dictionary, session exists, should return tokens',
      fakeAsync(
        inject([CrdsAuthenticationService], (service: CrdsAuthenticationService) => {
          mokta.tokenManager.get.and.returnValues(Promise.resolve(null), Promise.resolve(null));
          mokta.session.exists.and.returnValues(Promise.resolve(true));
          mokta.token.getWithoutPrompt.and.returnValue(Promise.resolve(['token1', 'token2']));
          let tokens;
          service.authenticated().subscribe(t => {
            tokens = t;
          });
          tick(15000);
          expect(tokens).toEqual(CRDSTokens.From({ access_token: 'token1', id_token: 'token2' }));
          expect(mokta.session.exists).toHaveBeenCalled();
        })
      )
    );

    it(
      'tokens not in dictionary, session doesnt exists, should return null',
      fakeAsync(
        inject([CrdsAuthenticationService], (service: CrdsAuthenticationService) => {
          mokta.session.exists.and.returnValue(Promise.resolve(false));
          mokta.tokenManager.get.and.returnValues(Promise.resolve(null), Promise.resolve(null));
          let tokens;
          service.authenticated().subscribe(t => {
            tokens = t;
          });
          tick(15000);

          expect(tokens).toEqual(null);
          expect(mokta.token.getWithoutPrompt).not.toHaveBeenCalled();
          expect(mokta.session.exists).toHaveBeenCalled();
        })
      )
    );
  });

  describe('Signout Tests', () => {
    it('signout success', inject(
      [CrdsAuthenticationService],
      fakeAsync((service: CrdsAuthenticationService) => {
        mokta.signOut.and.returnValue(Promise.resolve(null));

        let res;
        service.signOut().subscribe(result => {
          res = result;
        })
        tick(15000);
        expect(res).toEqual(true);
        expect(mokta.tokenManager.clear).toHaveBeenCalled();
      })
    ));

    it('signout failed', inject(
      [CrdsAuthenticationService],
      fakeAsync((service: CrdsAuthenticationService) => {
        mokta.signOut.and.returnValue(Promise.reject(null));

        let res;
        service.signOut().subscribe(result => {
          res = result;
        })
        tick(15000);
        expect(res).toEqual(false);
        expect(mokta.tokenManager.clear).not.toHaveBeenCalled();
        expect(mockLoggerService.Error).toHaveBeenCalled();
      })
    ));
  });
});
