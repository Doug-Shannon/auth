export interface ICRDSTokens {
  access_token: any;
  id_token: any;
}

export class CRDSTokens implements ICRDSTokens {
  public access_token: any;
  public id_token: any;
  constructor(accessToken: any = null, idToken: any = null) {
    if (accessToken != null) {
      this.access_token = accessToken;
    }
    if (idToken != null) {
      this.id_token = idToken;
    }
  }

  public static From(inc: Partial<ICRDSTokens>): CRDSTokens {
    const { access_token, id_token } = inc;
    return new CRDSTokens(access_token, id_token);
  }
}
