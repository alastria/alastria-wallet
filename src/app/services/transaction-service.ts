import { Injectable } from "@angular/core";
import * as Web3 from "web3";
import { AppConfig } from "../../app.config";
import { transactionFactory, tokensFactory } from "alastria-identity-lib";

// Services
import { Web3Service } from "./web3-service";
import { IdentityService } from "./identity-service";
import { SecuredStorageService } from "./securedStorage.service";

// Models
import { PresentationStatus } from './../models/presentation-status.model';
import { CredentialStatus } from './../models/credential-status.model';

@Injectable({
    providedIn: 'root',
})
export class TransactionService {

    private web3: Web3;

    constructor(
        private web3Srv: Web3Service,
        private identitySrv: IdentityService,
        private securedStrg: SecuredStorageService
    ) {
        this.web3 = this.web3Srv.getWeb3();
    }


    public createAndAddSubjectCredential(kidCredential, didIsssuer, subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti, uri): Promise<any> {
        let credential = tokensFactory.tokens.createCredential(kidCredential, didIsssuer,
            subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti);
  
        return this.securedStrg.get('userPrivateKey').then( privateKey => {
            let signedJWTCredential = tokensFactory.tokens.signJWT(credential, privateKey);
    
            let credentialHash = tokensFactory.tokens.PSMHash(this.web3, signedJWTCredential, didIsssuer);
    
            let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(this.web3, credentialHash, uri); //aqui no funciona
            return this.identitySrv.getKnownTransaction(subjectCredential).then((subjectCredentialSigned: string) => {
                return this.sendSigned(subjectCredentialSigned);
            }).then(() => {
                return credentialHash;
            });
        });
    }

    public addSubjectCredential(credential, didIsssuer, uri): Promise<any> {
        this.identitySrv.setUserDID(credential[AppConfig.PAYLOAD][AppConfig.SUBJECT]);
        return this.createAndAddSubjectCredential(credential[AppConfig.HEADER][AppConfig.KID], didIsssuer,
            credential[AppConfig.PAYLOAD][AppConfig.SUBJECT], credential[AppConfig.PAYLOAD][AppConfig.VC][AppConfig.context],
            credential[AppConfig.PAYLOAD][AppConfig.VC][AppConfig.CREDENTIALS_SUBJECT], credential[AppConfig.PAYLOAD][AppConfig.EXP],
            credential[AppConfig.PAYLOAD][AppConfig.NBF], credential[AppConfig.PAYLOAD][AppConfig.JTI], uri);
    }



    public getCurrentPublicKey(DID: string): Promise<any> {
        DID = DID.split(":")[4];
        let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(this.web3, DID)

        return this.web3.eth.call(currentPubKey)
            .then(result => {
                let pubKey = this.web3.eth.abi.decodeParameters(['string'], result)
                let publicKey = pubKey[0]
                return publicKey;
            })
            .catch(error => {
                console.error('Error -------->', error)
            })
    }

    public sendSigned(subjectObjectSigned: string): Promise<any> { //:Promise<void | TransactionReceipt>
        return this.web3.eth.sendSignedTransaction(subjectObjectSigned).
            then(transactionHash => {
                return transactionHash;
            }).catch(e => {
                console.error("Error in transaction (sendTx function): " + e);
                throw e;
            });
    }

    public getSubjectPresentationStatus(subject: string, presentationHash: string): Promise<PresentationStatus> {
        let presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(this.web3, subject, presentationHash);
        return this.web3.eth.call(presentationStatus).then(result => {
            let resultStatus = this.web3.eth.abi.decodeParameters(["bool", "uint8"], result);
            let presentationStatus: PresentationStatus = resultStatus;
            return presentationStatus;
        })
    }

    public getSubjectCredentialStatus(subject: string, credentialHash: string): Promise<CredentialStatus> {
        let subjectCredentialTransaction = transactionFactory.credentialRegistry.getSubjectCredentialStatus(this.web3, subject, credentialHash);
        return this.web3.eth.call(subjectCredentialTransaction).then(SubjectCredentialStatus => {
            let result = this.web3.eth.abi.decodeParameters(["bool", "uint8"], SubjectCredentialStatus);
            let credentialStatus: CredentialStatus = result;
            return credentialStatus;
        });
    }


}
