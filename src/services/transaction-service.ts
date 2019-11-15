import { Injectable } from "@angular/core";
import { transactionFactory, tokensFactory } from "alastria-identity-lib"
import { Web3Service } from "./web3-service";
import { IdentityService } from "./identity-service";

@Injectable()
export class TransactionService {

    private web3: any;

    constructor(
        private web3Srv: Web3Service,
        private identitySrv: IdentityService
    ){ 
        this.web3 = this.web3Srv.getWeb3();
    }

    public addSubjectCredential(kidCredential, didIsssuer, subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti, uri){
        let credential = tokensFactory.tokens.createCredential(kidCredential, didIsssuer, 
            subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti);

        let signedJWTCredential = tokensFactory.tokens.signJWT(credential, this.identitySrv.getPrivateKey());
        
        let credentialHash = tokensFactory.tokens.PSMHash(this.web3, signedJWTCredential, didIsssuer);

        let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(this.web3, credentialHash, uri);
    }

}
