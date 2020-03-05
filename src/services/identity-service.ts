import { Injectable } from "@angular/core";
import { UserIdentity } from "alastria-identity-lib";
import { Web3Service } from "./web3-service";
import * as Web3 from "web3";
import { IdentitySecuredStorageService } from "./securedStorage.service";

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

    public init(): Promise<any> {
        return this.secureStorage.get('ethAddress').then( address => {
            this.secureStorage.get('userPrivateKey').then( privateKey => {
                this.subjectPrivateKey = privateKey;
                this.subjectIdentity = new UserIdentity(this.web3, address, privateKey.substr(2), null);
                this.secureStorage.getDID().then(DID => this.userDID = DID);
                return this.subjectIdentity
            })
        })
    }
}
