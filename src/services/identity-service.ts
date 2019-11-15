import { Injectable } from "@angular/core";
import * as keythereum from "keythereum"
import { HttpClient } from "@angular/common/http";
import { UserIdentity } from "alastria-identity-lib"

@Injectable()
export class IdentityService {

    private configData: any;

    private subjectPublicKey: string;
    private subjectPrivateKey: string;
    private subjectIdentity: any;

    public constructor(private http: HttpClient) { }

    public init(web3: any) {
        this.http.get("../assets/app-config.json").subscribe(response => {
            this.configData = response;
            let identityKeystore = this.configData.identityKeystore

            try {
                this.subjectPrivateKey = keythereum.recover(this.configData.addressPassword, identityKeystore)
            } catch (error) {
                console.log("ERROR: ", error)
            }
            this.subjectIdentity = new UserIdentity(web3, `0x${identityKeystore.address}`, this.subjectPrivateKey, null);

            console.log("IdentityService initialized");
        });

    }

    public getPrivateKey(): string {
        return this.subjectPrivateKey;
    }

}
