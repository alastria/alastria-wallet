import { Injectable } from "@angular/core";
import { transactionFactory, tokensFactory } from "alastria-identity-lib";

// Services
import { IdentityService } from "./identity-service";

// Models
import { PresentationStatus } from './../models/presentation-status.model';
import { CredentialStatus } from './../models/credential-status.model';

@Injectable()
export class TransactionService {

    constructor(
        private identitySrv: IdentityService
    ) {}


    public createAndAddSubjectCredential(web3, credential, didSubject, uri): Promise<any> {
        let credentialHash = tokensFactory.tokens.PSMHash(web3, credential, didSubject);

        let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(web3, credentialHash, uri); //aqui no funciona
        return this.identitySrv.getKnownTransaction(web3, subjectCredential).then((subjectCredentialSigned: string) => {
            return this.sendSigned(web3, subjectCredentialSigned);
        }).then(() => {
            return credentialHash;
        });
        
    }

    public addSubjectCredential(web3, credential, didSubject, uri): Promise<any> {
        return this.createAndAddSubjectCredential(web3, credential, didSubject, uri);
    }



    public getCurrentPublicKey(web3: any, DID: string): Promise<any> {
        DID = DID;
        let currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, DID)

        return web3.eth.call(currentPubKey)
            .then(result => {
                let pubKey = web3.eth.abi.decodeParameters(['string'], result)
                let publicKey = pubKey[0]
                return publicKey;
            })
            .catch(error => {
                console.error('Error -------->', error)
            })
    }

    public sendSigned(web3: any, subjectObjectSigned: string): Promise<any> { //:Promise<void | TransactionReceipt>
        return web3.eth.sendSignedTransaction(subjectObjectSigned).
            then(transactionHash => {
                return transactionHash;
            }).catch(e => {
                console.error("Error in transaction (sendTx function): " + e);
                throw e;
            });
    }

    public getSubjectPresentationStatus(web3: any, subject: string, presentationHash: string): Promise<PresentationStatus> {
        let presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(web3, subject, presentationHash);
        return web3.eth.call(presentationStatus).then(result => {
            let resultStatus = web3.eth.abi.decodeParameters(["bool", "uint8"], result);
            let presentationStatus: PresentationStatus = resultStatus;
            return presentationStatus;
        })
    }

    public getSubjectCredentialStatus(web3: any, subject: string, credentialHash: string): Promise<CredentialStatus> {
        let subjectCredentialTransaction = transactionFactory.credentialRegistry.getSubjectCredentialStatus(web3, subject, credentialHash);
        return web3.eth.call(subjectCredentialTransaction).then(SubjectCredentialStatus => {
            let result = web3.eth.abi.decodeParameters(["bool", "uint8"], SubjectCredentialStatus);
            let credentialStatus: CredentialStatus = result;
            return credentialStatus;
        });
    }

    public async getEntity(web3: any, did: string): Promise<any> {
        let entityTX = transactionFactory.identityManager.getEntity(web3, did);
        let result = await web3.eth.call(entityTX)
        let entityDecode = web3.eth.abi.decodeParameters(["string", "string", "string", "string", "string", "bool"], result)
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
