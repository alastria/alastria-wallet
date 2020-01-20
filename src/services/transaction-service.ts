import { Injectable } from "@angular/core";
import { transactionFactory, tokensFactory } from "alastria-identity-lib"
import { Web3Service } from "./web3-service";
import { IdentityService } from "./identity-service";
import { SubjectCredential } from "../models/subject-credential.model";
import * as Web3 from "web3";
import { CredentialStatus } from "../models/credential-status.model";
import { AppConfig } from "../app.config";
import { PresentationStatus } from "../models/presentation-status.model";

@Injectable()
export class TransactionService {

    private web3: Web3;

    constructor(
        private web3Srv: Web3Service,
        private identitySrv: IdentityService
    ) {
        this.web3 = web3Srv.getWeb3();
    }


    public createAndAddSubjectCredential(kidCredential, didIsssuer, subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti, uri): Promise<any> {
        let credential = tokensFactory.tokens.createCredential(kidCredential, didIsssuer, 
            subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti);
        console.log("The credential1 is: " + credential);

        let signedJWTCredential = tokensFactory.tokens.signJWT(credential, this.identitySrv.getPrivateKey());
        console.log("The signed token is: " + signedJWTCredential);

        let credentialHash = tokensFactory.tokens.PSMHash(this.web3, signedJWTCredential, didIsssuer);
        console.log("The PSMHash is:" + credentialHash);

        let subjectCredential = transactionFactory.credentialRegistry.addSubjectCredential(this.web3, credentialHash, uri); //aqui no funciona

        return this.identitySrv.getKnownTransaction(subjectCredential).then((subjectCredentialSigned: string) => {
            console.log("(addSubjectCredential)The transaction bytes data is: " + subjectCredentialSigned);
            return this.sendSigned(subjectCredentialSigned);
        }).then(receipt => {
            console.log("RECEIPT:" + receipt);
        })
    }

    public addSubjectCredential(credential, didIsssuer, uri): Promise<any> {
        return this.createAndAddSubjectCredential(credential[AppConfig.HEADER][AppConfig.KID],didIsssuer,
            credential[AppConfig.PAYLOAD][AppConfig.subject],credential[AppConfig.PAYLOAD][AppConfig.VC][AppConfig.context], 
            credential[AppConfig.PAYLOAD][AppConfig.VC][AppConfig.CREDENTIALS_SUBJECT],credential[AppConfig.PAYLOAD][AppConfig.EXP],
            credential[AppConfig.PAYLOAD][AppConfig.NBF],credential[AppConfig.PAYLOAD][AppConfig.JTI],uri);
    }

    public getSubjectCredentialList(subject: string): Promise<any> {
        console.log("Getting Creedential List for subject " + subject);
        let credentialList = transactionFactory.credentialRegistry.getSubjectCredentialList(this.web3, subject)
        return this.web3.eth.call(credentialList).then(subjectCredentialList => {
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

    public getSubjectCredentialStatus(subject: string, credentialHash: string): Promise<CredentialStatus> {
        console.log("Getting Creedential status for: " + credentialHash);
        let subjectCredentialTransaction = transactionFactory.credentialRegistry.getSubjectCredentialStatus(this.web3, subject, credentialHash);
        return this.web3.eth.call(subjectCredentialTransaction).then(SubjectCredentialStatus => {
            let result = this.web3.eth.abi.decodeParameters(["bool", "uint8"], SubjectCredentialStatus);
            let credentialStatus: CredentialStatus = result;
            console.log("(SubjectCredentialStatus) -----> " + credentialStatus);
            return credentialStatus;
        });
    }

    public getSubjectPresentationStatus(subject: string, presentationHash: string): Promise<PresentationStatus> {
        let presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(this.web3, subject, presentationHash);
        return this.web3.eth.call(presentationStatus).then(result => {
            let resultStatus = this.web3.eth.abi.decodeParameters(["bool", "uint8"], result);
            let presentationStatus: PresentationStatus = resultStatus;
            console.log('presentationStatus ------>', presentationStatus);
            return presentationStatus;
        })
    }

    public getSubjectPresentationList(subject: string): Promise<any> {
        let presentationList = transactionFactory.presentationRegistry.getSubjectPresentationList(this.web3, subject);
        return this.web3.eth.call(presentationList).then(subjectPresentationList => {
            console.log('(subjectPresentationList) Transaction ------->', subjectPresentationList);
            let resultList = this.web3.eth.abi.decodeParameters(["uint256", "bytes32[]"], subjectPresentationList);
            let presentationListresult = {
                "uint": resultList[0],
                "bytes32[]": resultList[1]
            };
            return presentationListresult;
        })
    }

    public updateSubjectPresentation(subject: string, presentationHash: string, updateTo: number): Promise<PresentationStatus> {
        let updateSubjectPresentation = transactionFactory.presentationRegistry.updateSubjectPresentation(this.web3, presentationHash, updateTo);
        return this.identitySrv.getKnownTransaction(updateSubjectPresentation).then(res => {
            let presentationStatus = transactionFactory.presentationRegistry.getSubjectPresentationStatus(this.web3, subject, presentationHash);
            return this.web3.eth.call(presentationStatus);
        }).then(result => {
            let resultStatus = this.web3.eth.abi.decodeParameters(["bool", "uint8"], result)
            let presentationStatus: PresentationStatus = resultStatus;
            return presentationStatus;
        });
    }

    private sendSigned(subjectCredentialSigned: string): Promise<any> { //:Promise<void | TransactionReceipt>
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
