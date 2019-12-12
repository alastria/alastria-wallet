import { Injectable } from "@angular/core";
import { transactionFactory, tokensFactory } from "alastria-identity-lib"
import { Web3Service } from "./web3-service";
import { IdentityService } from "./identity-service";
import { SubjectCredential } from "../models/subject-credential.model";
import * as Web3 from "web3";
import { CredentialStatus } from "../models/credential-status.model";

@Injectable()
export class TransactionService {

    private web3: Web3;

    constructor(
        private web3Srv: Web3Service,
        private identitySrv: IdentityService
    ) {
        this.web3 = web3Srv.getWeb3(); 
    }


    public addSubjectCredential(kidCredential, didIsssuer, subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti, uri): Promise<CredentialStatus> {
        let credential = tokensFactory.tokens.createCredential(kidCredential, didIsssuer, 
            subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti);

        let signedJWTCredential = tokensFactory.tokens.signJWT(credential, this.identitySrv.getPrivateKey());
        
        let credentialHash = tokensFactory.tokens.PSMHash(this.web3, signedJWTCredential, didIsssuer);

        let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(this.web3, credentialHash, uri); //aqui no funciona

        return this.identitySrv.getKnownTransaction(subjectCredential).then((subjectCredentialSigned: string) => {
            console.log("(addSubjectCredential)The transaction bytes data is: " + subjectCredentialSigned);
            return this.sendSigned(subjectCredentialSigned);
        }).then(receipt => {
            console.log("RECEIPT:" + receipt)
            let subject = subjectAlastriaID;
            let subjectCredentialTransaction = transactionFactory.credentialRegistry.getCredentialStatus(this.web3, subject, credentialHash);
            return this.web3.eth.call(subjectCredentialTransaction);
        }).then(SubjectCredentialStatus => {
            let result = this.web3.eth.abi.decodeParameters(["bool", "uint8"], SubjectCredentialStatus);
            let credentialStatus: CredentialStatus = result;
            console.log("(SubjectCredentialStatus) -----> " + credentialStatus);
            return credentialStatus;
        });
    }

    public getSubjectCredentialList(subject: string) {
        console.log("Getting Creedential List for subject " + subject);
        let credentialList = transactionFactory.credentialRegistry.getSubjectCredentialList(this.web3, subject)
        return this.web3.call(credentialList).then(subjectCredentialList => {
            console.log("(subjectCredentialList) Transaction ------->", subjectCredentialList);
            let resultList = this.web3.eth.abi.decodeParameters(["uint256", "bytes32[]"], subjectCredentialList);
            let credentialList = {
                "uint": resultList[0],
                "bytes32[]": resultList[1]
            }
            console.log("(subjectCredentialList) TransactionList: ", credentialList);
            return credentialList;
        });
    }
    
    private sendSigned(subjectCredentialSigned: string): any { //:Promise<void | TransactionReceipt>
        return this.web3.eth.sendSignedTransaction(subjectCredentialSigned).
        then(transactionHash => {
            console.log("Hash transaction" + transactionHash);
            return transactionHash;
        }).catch(e => {
            console.log("Error in transaction (sendTx function): " + e);
            throw e;
        });
	}
}
