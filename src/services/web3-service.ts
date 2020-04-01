import { Injectable } from "@angular/core";
import * as Web3 from "web3";
import { AppConfig } from "../app.config";

@Injectable()
export class Web3Service {

    private nodeIp: string;
    private web3: Web3;

    public constructor() {
        this.nodeIp = AppConfig.nodeURL;
        this.web3 = new Web3(this.nodeIp);
    }

    public getWeb3(): Web3 {
        return this.web3;
    }
}
