export interface CRDSOktaConfig {
  oktaBase: {
    url: string;
    clientId: string;
    redirectUri: string;
    // fromUri: string;
    idps: { type: string; id: string }[];
  };
  tokenInjectorDomains: string[];
  logging: boolean;
}
