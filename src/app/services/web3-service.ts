import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

@Injectable({
    providedIn: 'root',
})
export class Web3Service {

    private web3: Web3;

    public constructor() {}

    public getWeb3(nodeIp): Web3 {
        this.web3 = new Web3(nodeIp);
        return this.web3;
    }
}
