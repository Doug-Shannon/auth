import { LoggerService } from './logger.service';
import { TestBed, inject } from '@angular/core/testing';

describe('LoggerService', () => {
  describe('Logging On', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: LoggerService,
            useFactory: () => new LoggerService(true),
            multi: false,
            deps: []
          }
        ]
      });
    });

    it('should be created', inject([LoggerService], (service: LoggerService) => {
      expect(service).toBeTruthy();
    }));

    it('should console.error', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'error');

      service.Error('test')

      expect(console.error).toHaveBeenCalled();
    }));

    it('should console.warn', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'warn');

      service.Warn('test')

      expect(console.warn).toHaveBeenCalled();
    }));

    it('should console.info', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'info');

      service.Info('test')

      expect(console.info).toHaveBeenCalled();
    }));

    it('should console.log', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'log');

      service.Log('test')

      expect(console.log).toHaveBeenCalled();
    }));
  });
  describe('Logging Off', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: LoggerService,
            useFactory: () => new LoggerService(false),
            multi: false,
            deps: []
          }
        ]
      });
    });

    it('should be created', inject([LoggerService], (service: LoggerService) => {
      expect(service).toBeTruthy();
    }));

    it('should not console.error', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'error');

      service.Error('test')

      expect(console.error).not.toHaveBeenCalled();
    }));

    it('should not console.warn', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'warn');

      service.Warn('test')

      expect(console.warn).not.toHaveBeenCalled();
    }));

    it('should not console.info', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'info');

      service.Info('test')

      expect(console.info).not.toHaveBeenCalled();
    }));

    it('should not console.log', inject([LoggerService], (service: LoggerService) => {
      spyOn(console, 'log');

      service.Log('test')

      expect(console.log).not.toHaveBeenCalled();
    }));
  });
});
