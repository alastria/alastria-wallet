import { Injectable } from "@angular/core";
import * as Web3 from "web3";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

@Injectable()
export class Web3Service {

    public initObs: Observable<void>;

    private configData: any;
    private nodeIp: string;
    private web3: Web3;


    public constructor(private http: HttpClient) { }

    public getWeb3(): Web3 {
        return this.web3;
    }

    public init(): Observable<void> {
        this.initObs = this.http.get("../assets/app-config.json").pipe(map(response => {
            this.configData = response;
            this.nodeIp = this.configData.nodeURL;
            this.web3 = new Web3(this.nodeIp);

            console.log("Web3Service initialized");
        }));
        return this.initObs;
    }

}
