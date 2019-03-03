import { CRDSOktaConfig } from './../crds-okta-auth.module';
import { InjectionToken } from '@angular/core';

export const OktaWidgetConfigService = new InjectionToken<CRDSOktaConfig>('OktaConfig');
