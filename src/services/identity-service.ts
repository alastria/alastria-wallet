import { Injectable } from "@angular/core";
import * as keythereum from "keythereum"
import { UserIdentity } from "alastria-identity-lib";
import { SubjectCredential } from "../models/subject-credential.model";
import { KeyStore } from "../keystore";
import { AppConfig } from "../app.config";
import { Web3Service } from "./web3-service";
import * as Web3 from "web3";
import { IdentitySecuredStorageService } from "./securedStorage.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Injectable()
export class IdentityService {

    private subjectPublicKey: string;
    private subjectPrivateKey: string;
    private subjectIdentity: UserIdentity;
    private userDID: string;
    private web3: Web3;

    constructor(
        private web3Srv: Web3Service,
        private secureStorage: IdentitySecuredStorageService
    ) {
        this.web3 = web3Srv.getWeb3();
        this.init();
    }

    public getPrivateKey(): string {
        return this.subjectPrivateKey;
    }

    public getKnownTransaction(subjectCredential): Promise<string> {
        return this.subjectIdentity.getKnownTransaction(subjectCredential);
    }

    public getSubjectAddress() {
        return this.subjectIdentity.address;
    }

    public setUserDID(DID: string){
        if (!this.userDID) {
            this.userDID = DID;
            this.secureStorage.setDID(DID);
        }
    }

    public getUserDID(): string {
        return this.userDID
    }

    private init() {
        let identityKeystore = KeyStore.identityKeystore;
        try {
            this.subjectPrivateKey = keythereum.recover(AppConfig.addressPassword, identityKeystore)
        } catch (error) {
            console.log("ERROR: ", error)
        }
        this.subjectIdentity = new UserIdentity(this.web3, `0x${identityKeystore.address}`, this.subjectPrivateKey, null);
        this.secureStorage.getDID().then(DID => this.userDID = DID);
    }
}
