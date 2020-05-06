import { Injectable } from "@angular/core";
import { tokensFactory } from "alastria-identity-lib";
import { AppConfig } from '../../app.config';

// Services
import { SecuredStorageService } from "./securedStorage.service";

@Injectable({
    providedIn: 'root',
})
export class TokenService {

    private readonly ATR_CREDENTIAL = "verifiableCredential";
    private readonly ATR_PRESENTATION_REQUEST = "pr";
    private readonly TYPE_CREDENTIAL_OFFER = "presentation";
    private readonly TYPE_AUTH = "authentication";
    private readonly TYPE_PRESENTATION_REQ = "presentationRequest";

    constructor(private securedStrg: SecuredStorageService) {
    }

    public async getTokenType(token: string | object) {
        let tokenType: string;
        return this.securedStrg.hasKey(AppConfig.IS_IDENTITY_CREATED).then(result => {
            if (token[this.ATR_CREDENTIAL]) {
                tokenType = this.TYPE_CREDENTIAL_OFFER
            } else if (token[AppConfig.PAYLOAD][this.ATR_PRESENTATION_REQUEST]) {
                tokenType = this.TYPE_PRESENTATION_REQ;
            } else if (token[AppConfig.PAYLOAD][AppConfig.ANI]) {
                if (result) {
                    const pathSplit = token[AppConfig.PAYLOAD][AppConfig.CBU].split('/');
                    const lastPath = pathSplit[pathSplit.length -1];
                    if (lastPath === 'identity') {
                        tokenType = AppConfig.ALASTRIA_TOKEN;
                    } else {
                        tokenType = AppConfig.IDENTITY_SETUP;
                    }
                } else {
                    tokenType = AppConfig.ALASTRIA_TOKEN;
                }

            } else {
                tokenType = this.TYPE_AUTH;
            }

            return tokenType;
        });
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
}
