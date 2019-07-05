import { Injectable } from '@angular/core';
import { verify } from 'jsonwebtoken';

@Injectable()
export class TokenService {

  private readonly ATR_CREDENTIAL = "credential";
  private readonly ATR_CREDENTIALS = "credentials";
  private readonly TYPE_CREDENTIAL_REQ = "credentialRequest";
  private readonly TYPE_AUTH = "authentication";
  private readonly SECRET = "your-256-bit-secret";

  constructor() {
    console.log("TokenService initialized");
  }

  public getTokenType(token: string | object): string{
    let tokenType: string;
    if(token[this.ATR_CREDENTIAL] || token[this.ATR_CREDENTIALS]){
      tokenType = this.TYPE_CREDENTIAL_REQ
    }else{
      tokenType = this.TYPE_AUTH;
    }
    return tokenType;
  }

  public getSessionToken(verifiedToken:string|object): object{
    let alastriaSession;
    let currDate: any = new Date();
    currDate = currDate.getTime();

    let iss = verifiedToken["iss"];
    let issName;
    let cbu;

    if (iss){
      issName = "SERVICE PROVIDER";
      cbu = verifiedToken["cbu"];

      alastriaSession = {
        "@context": "https://w3id.org/did/v1",
        "iss": "did:ala:quor:telsius:0x123ABC",
        "pku": this.SECRET,
        "iat": currDate,
        "exp": currDate + 5 * 60 * 1000,
        "nbf ": currDate,
        "data": verifiedToken
      };
    }else{
      alastriaSession = null;
    }
    return alastriaSession;
  }

  public verifyToken(token: string, secret: string): string|object{
    return verify(token, secret, { algorithms: ['HS256'] });
  }

}
