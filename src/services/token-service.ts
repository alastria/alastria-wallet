import { Injectable } from "@angular/core";
import { verify, sign, decode } from "jsonwebtoken";
import { tokensFactory } from "alastria-identity-lib";
import { AppConfig } from '../app.config';
import { IdentitySecuredStorageService } from "./securedStorage.service";

@Injectable()
export class TokenService {

    private readonly ATR_CREDENTIAL = "verifiableCredential";
    private readonly ATR_PRESENTATION_REQUEST = "pr";
    private readonly TYPE_CREDENTIAL_OFFER = "presentation";
    private readonly TYPE_AUTH = "authentication";
    private readonly TYPE_PRESENTATION_REQ = "presentationRequest";
    private readonly SECRET = "your-256-bit-secret";

    constructor(private secureStorage: IdentitySecuredStorageService) {
        console.log("TokenService initialized");
    }

    public async getTokenType(token: string | object) {
        let tokenType: string;
        return this.secureStorage.hasKey(AppConfig.IS_IDENTITY_CREATED).then(result => {
            if (token[this.ATR_CREDENTIAL]) {
                tokenType = this.TYPE_CREDENTIAL_OFFER
            } else if (token[AppConfig.PAYLOAD][this.ATR_PRESENTATION_REQUEST]) {
                tokenType = this.TYPE_PRESENTATION_REQ;
            } else if (token[AppConfig.PAYLOAD][AppConfig.ANI]) {
                if (result) {
                    tokenType = AppConfig.IDENTITY_SETUP;
                } else {
                    tokenType = AppConfig.ALASTRIA_TOKEN;
                }

            } else {
                tokenType = this.TYPE_AUTH;
            }

            return tokenType;
        });
    }

    public getSessionToken(verifiedToken: string | object): object {
        let alastriaSession;
        let currDate: any = new Date();
        currDate = currDate.getTime();

        let iss = verifiedToken["iss"];
        let issName;
        let cbu;

        if (iss) {
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
        } else {
            alastriaSession = null;
        }
        return alastriaSession;
    }

    public verifyToken(token: string, secret: string): string | object {
        return verify(token, secret, { algorithms: ["HS256"] });
    }

    public decodeToken(token: string): string | object {
        let decodedToken = decode(token, { complete: true })
        delete decodedToken["signature"];
        decodedToken["header"]["alg"] = "ES256K"
        return decodedToken;
    }

    public decodeTokenES(token: string): string | object {
        let decodedToken = tokensFactory.tokens.decodeJWT(token);
        return decodedToken;
    }

    public verifyTokenES(token: string, pku: string): string | object {
        let decodedToken = tokensFactory.tokens.verifyJWT(token, pku);
        return decodedToken;
    }

    public signTokenES(token: string, privateKey: string) {
        let signedToken = tokensFactory.tokens.signJWT(token, privateKey);
        return signedToken;
    }

    public signToken(payload: string, secret?: string): string | object {
        secret = secret ? secret : this.SECRET;
        return sign(payload, secret);
    }

    public verifyAndGetCredentialData(tokens: Array<string>, secret?: string): Array<any> {
        secret = secret ? secret : this.SECRET;
        return tokens.map(token => {
            let data = this.verifyToken(token, secret);
            return data["vc"]["credentialSubject"];
        });
    }
}
