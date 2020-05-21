import { Injectable } from '@angular/core';
import { UserIdentity } from 'alastria-identity-lib';
import { SecuredStorageService } from './securedStorage.service';

@Injectable({
    providedIn: 'root',
})
export class IdentityService {

    private subjectPrivateKey: string;
    private subjectIdentity: UserIdentity;
    private userDID: string;

    constructor(
        private securedStrg: SecuredStorageService
    ) {}

    public getPrivateKey(): string {
        return this.subjectPrivateKey;
    }

    public async getKnownTransaction(web3, subjectCredential): Promise<string> {
        if (!this.subjectIdentity) {
            await this.init(web3);
        }
        return this.subjectIdentity.getKnownTransaction(subjectCredential);
    }

    public getSubjectAddress() {
        return this.subjectIdentity.address;
    }

    public setUserDID(DID: string) {
        if (!this.userDID) {
            this.userDID = DID;
            this.securedStrg.setDID(DID);
        }
    }

    public getUserDID(): string {
        return this.userDID;
    }

    public init(web3: any): Promise<any> {
        return this.securedStrg.get('ethAddress').then( address => {
            return this.securedStrg.get('userPrivateKey').then( privateKey => {
                this.subjectPrivateKey = privateKey;
                this.subjectIdentity = new UserIdentity(web3, address, privateKey.substr(2), 0);
                this.securedStrg.get('userDID').then(DID => this.userDID = DID);
                return this.subjectIdentity;
            });
        });
    }
}
