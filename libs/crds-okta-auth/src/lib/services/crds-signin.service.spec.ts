import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { CrdsSigninService } from './crds-signin.service';

describe('CrdsSigninService', () => {
  let mokta, mockSignInConfig, mockCookies, mockLogger;
  beforeEach(() => {
    mokta = {
      session: jasmine.createSpyObj('session', ['exists', 'get']),
      token: jasmine.createSpyObj('token', ['parseFromUrl', 'getWithoutPrompt']),
      tokenManager: jasmine.createSpyObj('tokenManager', ['add', 'get', 'clear'])
    };
    mockSignInConfig = { a: 1, b: 2, c: 3 };
    mockCookies = jasmine.createSpyObj('cookies', ['get', 'set', 'delete']);
    mockLogger = jasmine.createSpyObj('log', ['Error']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CrdsSigninService,
          useFactory: () => new CrdsSigninService(mokta, mockSignInConfig, mockCookies, mockLogger),
          multi: false,
          deps: []
        }
      ]
    });
  });

  it('should be created', inject([CrdsSigninService], (service: CrdsSigninService) => {
    expect(service).toBeTruthy();
  }));

  describe('redirectToOriginUrl tests', () => {
    it('should find redirect_url and use it', inject([CrdsSigninService], (service: CrdsSigninService) => {
      const redirect_url = 'itsawebsite.com';
      mockCookies.get.and.returnValue(redirect_url);
      spyOn<any>(service, 'windowLocationReplace').and.returnValue(null);

      service.redirectToOriginUrl();

      expect(mockCookies.delete).toHaveBeenCalledWith('redirect_url');
      expect(mockCookies.get).toHaveBeenCalledWith('redirect_url');
      expect(service['windowLocationReplace']).toHaveBeenCalledWith(redirect_url);
    }));

    it('should not find redirect_url and use crossroads.net', inject(
      [CrdsSigninService],
      (service: CrdsSigninService) => {
        mockCookies.get.and.returnValue(null);
        spyOn<any>(service, 'windowLocationReplace').and.returnValue(null);

        service.redirectToOriginUrl();

        expect(mockCookies.delete).toHaveBeenCalledWith('redirect_url');
        expect(mockCookies.get).toHaveBeenCalledWith('redirect_url');
        expect(service['windowLocationReplace']).toHaveBeenCalledWith('https://www.crossroads.net');
      }
    ));
  });

  describe('runSigninFlow tests', () => {
    it('runSigninFlow should find tokens in URL', inject(
      [CrdsSigninService],
      fakeAsync((service: CrdsSigninService) => {
        mokta.token.parseFromUrl.and.returnValue(Promise.resolve(['idtoken', 'accesstoken']));
        spyOn<any>(service, 'handleIfActiveSession');
        spyOn<any>(service, 'setRedirectUrl');

        let actual;
        service.runSigninFlow().subscribe(res => {
          actual = res;
        });
        tick(15000);

        expect(actual).toEqual(true);
        expect(mokta.tokenManager.add).toHaveBeenCalledTimes(2);
        expect(service['handleIfActiveSession']).not.toHaveBeenCalled();
        expect(service['setRedirectUrl']).not.toHaveBeenCalled();
      })
    ));
    it('runSigninFlow should not find tokens in URL but find active session', inject(
      [CrdsSigninService],
      fakeAsync((service: CrdsSigninService) => {
        mokta.token.parseFromUrl.and.returnValue(Promise.resolve(null));
        mokta.session.get.and.returnValue(Promise.resolve({status: 'ACTIVE'}));
        mokta.token.getWithoutPrompt.and.returnValue(Promise.resolve(['idtoken', 'accesstoken']))
        spyOn<any>(service, 'setRedirectUrl');

        let actual;
        service.runSigninFlow().subscribe(res => {
          actual = res;
        });
        tick(15000);

        expect(actual).toEqual(true);
        expect(mokta.tokenManager.add).toHaveBeenCalledTimes(2);
        expect(mokta.session.get).toHaveBeenCalled();
        expect(mokta.token.getWithoutPrompt).toHaveBeenCalled();
        expect(service['setRedirectUrl']).not.toHaveBeenCalled();
      })
    ));
    it('runSigninFlow should not find tokens in URL and not find active session', inject(
      [CrdsSigninService],
      fakeAsync((service: CrdsSigninService) => {
        mokta.token.parseFromUrl.and.returnValue(Promise.resolve(null));
        mokta.session.get.and.returnValue(Promise.resolve({status: 'INACTIVE'}));
        spyOn<any>(service, 'setRedirectUrl');

        let actual;
        service.runSigninFlow().subscribe(res => {
          actual = res;
        });
        tick(15000);

        expect(actual).toEqual(false);
        expect(mokta.tokenManager.add).not.toHaveBeenCalled();
        expect(mokta.session.get).toHaveBeenCalled();
        expect(mokta.token.getWithoutPrompt).not.toHaveBeenCalled();
        expect(service['setRedirectUrl']).toHaveBeenCalled();
      })
    ));
  });
});
