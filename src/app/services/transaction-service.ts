import { Injectable } from '@angular/core';
import { transactionFactory, tokensFactory } from 'alastria-identity-lib';

// Services
import { IdentityService } from './identity-service';

// Models
import { PresentationStatus } from './../models/presentation-status.model';
import { CredentialStatus } from './../models/credential-status.model';
import { AppConfig } from 'src/app.config';

@Injectable()
export class TransactionService {

    constructor(
        private identitySrv: IdentityService
    ) {}


    public createAndAddSubjectCredential(web3, credential, didSubject, uri): Promise<any> {
        const credentialHash = tokensFactory.tokens.PSMHash(web3, credential, didSubject);

        const subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(web3, credentialHash, uri); // aqui no funciona
        return this.identitySrv.getKnownTransaction(web3, subjectCredential).then((subjectCredentialSigned: string) => {
            return this.sendSigned(web3, subjectCredentialSigned);
        }).then(() => {
            return credentialHash;
        }).catch((error) => {
            throw error;
        });
    }

    public addSubjectCredential(web3, credential, didSubject, uri): Promise<any> {
        return this.createAndAddSubjectCredential(web3, credential, didSubject, uri);
    }



    public getCurrentPublicKey(web3: any, DID: string): Promise<any> {
        DID = DID;
        const currentPubKey = transactionFactory.publicKeyRegistry.getCurrentPublicKey(web3, DID);

        return web3.eth.call(currentPubKey)
            .then(result => {
                const pubKey = web3.eth.abi.decodeParameters(['string'], result);
                const publicKey = pubKey[0];
                return publicKey;
            })
            .catch(error => {
                console.error('Error -------->', error);
            });
    }

    public sendSigned(web3: any, subjectObjectSigned: string): Promise<any> { // :Promise<void | TransactionReceipt>
        return web3.eth.sendSignedTransaction(subjectObjectSigned).
            then(transactionHash => {
                return transactionHash;
            }).catch(e => {
                console.error('Error in transaction (sendTx function): ' + e);
                throw e;
            });
    }

    public getSubjectPresentationStatus(web3: any, subject: string, presentationHash: string): Promise<PresentationStatus> {
        const presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(web3, subject, presentationHash);
        return web3.eth.call(presentationStatus).then(result => {
            const resultStatus = web3.eth.abi.decodeParameters(['bool', 'uint8'], result);
            const presentationStatus: PresentationStatus = resultStatus;
            return presentationStatus;
        });
    }

    public revokeSubjectPresentation(web3: any, PSMHash: string): Promise<any> {
        const presentationRevoke = transactionFactory.presentationRegistry.updateSubjectPresentation(web3, PSMHash,
            AppConfig.ActivityStatusIndex.Revoked);
        return this.identitySrv.getKnownTransaction(web3, presentationRevoke).then((presentationRevokeSigned: string) => {
            return this.sendSigned(web3, presentationRevokeSigned);
        }).then(result => {
            return result;
        });
    }

    public getSubjectCredentialStatus(web3: any, subject: string, credentialHash: string): Promise<CredentialStatus> {
        const subjectCredentialTransaction =
            transactionFactory.credentialRegistry.getSubjectCredentialStatus(web3, subject, credentialHash);
        return web3.eth.call(subjectCredentialTransaction).then(SubjectCredentialStatus => {
            const result = web3.eth.abi.decodeParameters(['bool', 'uint8'], SubjectCredentialStatus);
            const credentialStatus: CredentialStatus = result;
            return credentialStatus;
        });
    }

    public async getEntity(web3: any, did: string): Promise<any> {
        const entityTX = transactionFactory.identityManager.getEntity(web3, did);
        const result = await web3.eth.call(entityTX);
        const entityDecode = web3.eth.abi.decodeParameters(['string', 'string', 'string', 'string', 'string', 'bool'], result);
        const entity = {
          name: entityDecode[0],
          cif: entityDecode[1],
          urlLogo: entityDecode[2],
          urlCreateAID: entityDecode[3],
          urlAOA: entityDecode[4],
          status: entityDecode[5]
        };

        if (entity.status === false) {
          throw new Error('This AlastriaDID is not an Entity');
        }

        return entity;
    }

}
