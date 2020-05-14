import { Injectable } from "@angular/core";
import * as Web3 from "web3";
import { transactionFactory, tokensFactory } from "alastria-identity-lib";

// Services
import { Web3Service } from "./web3-service";
import { IdentityService } from "./identity-service";

// Models
import { PresentationStatus } from './../models/presentation-status.model';
import { CredentialStatus } from './../models/credential-status.model';

@Injectable()
export class TransactionService {

    private web3: Web3;

    constructor(
        private web3Srv: Web3Service,
        private identitySrv: IdentityService,
    ) {
        this.web3 = this.web3Srv.getWeb3();
    }


    public createAndAddSubjectCredential(credential, didSubject, uri): Promise<any> {
        let credentialHash = tokensFactory.tokens.PSMHash(this.web3, credential, didSubject);

        let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(this.web3, credentialHash, uri); //aqui no funciona
        return this.identitySrv.getKnownTransaction(subjectCredential).then((subjectCredentialSigned: string) => {
            return this.sendSigned(subjectCredentialSigned);
        }).then(() => {
            return credentialHash;
        });
        
    }

    public addSubjectCredential(credential, didSubject, uri): Promise<any> {
        return this.createAndAddSubjectCredential(credential, didSubject, uri);
    }



    public getCurrentPublicKey(DID: string): Promise<any> {
        DID = DID;
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

    public async getEntity(did: string): Promise<any> {
        let entityTX = transactionFactory.identityManager.getEntity(this.web3, did);
        let result = await this.web3.eth.call(entityTX)
        let entityDecode = this.web3.eth.abi.decodeParameters(["string", "string", "string", "string", "string", "bool"], result)
        let entity = {
          "name": entityDecode[0],
          "cif":entityDecode[1],
          "urlLogo":entityDecode[2],
          "urlCreateAID":entityDecode[3],
          "urlAOA":entityDecode[4],
          "status":entityDecode[5]
        }

        if(entity.status == false) {
          throw "This AlastriaDID is not an Entity"
        }

        return entity
    }

}
