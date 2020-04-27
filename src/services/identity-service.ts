import { Injectable } from "@angular/core";
import { UserIdentity } from "alastria-identity-lib";
import { Web3Service } from "./web3-service";
import * as Web3 from "web3";
import { SecuredStorageService } from "./securedStorage.service";

@Injectable()
export class IdentityService {

    private subjectPrivateKey: string;
    private subjectIdentity: UserIdentity;
    private userDID: string;
    private web3: Web3;

    constructor(
        private web3Srv: Web3Service,
        private securedStrg: SecuredStorageService
    ) {
        this.web3 = this.web3Srv.getWeb3();
    }

    public getPrivateKey(): string {
        return this.subjectPrivateKey;
    }

    public async getKnownTransaction(subjectCredential): Promise<string> {
        if (!this.subjectIdentity) {
            await this.init();
        }
        return this.subjectIdentity.getKnownTransaction(subjectCredential);
    }

    public getSubjectAddress() {
        return this.subjectIdentity.address;
    }

    public setUserDID(DID: string){
        if (!this.userDID) {
            this.userDID = DID;
            this.securedStrg.setDID(DID);
        }
    }

    public getUserDID(): string {
        return this.userDID
    }

    public init(): Promise<any> {
        return this.securedStrg.get('ethAddress').then( address => {
            return this.securedStrg.get('userPrivateKey').then( privateKey => {
                this.subjectPrivateKey = privateKey;
                this.subjectIdentity = new UserIdentity(this.web3, address, privateKey.substr(2), null);
                this.securedStrg.get('userDID').then(DID => this.userDID = DID);
                return this.subjectIdentity
            })
        })
    }
}
