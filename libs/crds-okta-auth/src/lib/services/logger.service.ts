import { LoggingStatus } from '../provider/logging-status.provider';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(@Inject(LoggingStatus) private on: boolean) {}

  public Error(header: string, detail?: any) {
    if (this.on) {
      if (detail != null) {
        console.error(`CRDS-OKTA-AUTH: ${header}`, detail);
      } else {
        console.error(`CRDS-OKTA-AUTH: ${header}`);
      }
    }
  }

  public Warn(header: string, detail?: any) {
    if (this.on) {
      if (detail != null) {
        console.warn(`CRDS-OKTA-AUTH: ${header}`, detail);
      } else {
        console.warn(`CRDS-OKTA-AUTH: ${header}`);
      }
    }
  }

  public Info(header: string, detail?: any) {
    if (this.on) {
      if (detail != null) {
        console.info(`CRDS-OKTA-AUTH: ${header}`, detail);
      } else {
        console.info(`CRDS-OKTA-AUTH: ${header}`);
      }
    }
  }

  public Log(header: string, detail?: any) {
    if (this.on) {
      if (detail != null) {
        console.log(`CRDS-OKTA-AUTH: ${header}`, detail);
      } else {
        console.log(`CRDS-OKTA-AUTH: ${header}`);
      }
    }
  }
}
