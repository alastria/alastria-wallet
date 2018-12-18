import { Injectable } from '@angular/core';

import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

declare let require: any;
declare let window: any;


let tokenAbi = require('../../build/contracts/AlastriaPublicKeyRegistry.json');

@Injectable()
export class AlastriaPublicKeyRegistryService {

    GAS_LIMIT = 30000000000;

    private web3Provider: null;
    private contracts: {};

    constructor() {
        if (typeof window.web3 !== 'undefined') {
            this.web3Provider = window.web3.currentProvider;
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        window.web3 = new Web3(this.web3Provider);
    }

    getAccountInfo() {
        return new Promise((resolve, reject) => {
            window.web3.eth.getCoinbase(function (err, account) {
                if (err === null) {
                    window.web3.eth.getBalance(account, function (err, balance) {
                        if (err === null) {
                            return resolve({ fromAccount: account, balance: window.web3.fromWei(balance, 'ether') });
                        } else {
                            return reject('error');
                        }
                    });
                }
            });
        });
    }

    registrySet(publicKey: any, address: any) {
        return new Promise(
            (resolve, reject) => {
                let paymentContract = TruffleContract(tokenAbi);
                paymentContract.setProvider(this.web3Provider);
                paymentContract.web3.eth.defaultAccount = address;
                paymentContract.deployed().then(
                    (instance) => {
                        return instance.set(publicKey, {
                            gas: this.GAS_LIMIT
                        });
                    }
                ).then(
                    (status) => {
                        if (status) {
                            return resolve(status);
                        }
                    }
                ).catch(
                    (error) => {
                        return reject('Error in transferEther service call');
                    }
                );
            }
        );
    }

    registryStatus(address: any) {
        return new Promise(
            (resolve, reject) => {
                let paymentContract = TruffleContract(tokenAbi);
                paymentContract.setProvider(this.web3Provider);
                paymentContract.web3.eth.defaultAccount = address;
                paymentContract.deployed().then(
                    (instance) => {
                        return instance.currentPublicKey.call(address, {
                            gas: this.GAS_LIMIT
                        });
                    }
                ).then(
                    (status) => {
                        if (status) {
                            return resolve(status);
                        }
                    }
                ).catch(
                    (error) => {
                        return reject('Error in transferEther service call');
                    }
                );
            }
        );
    }

    registryStatusObject(address: any, publicKey: any) {
        return new Promise(
            (resolve, reject) => {
                let paymentContract = TruffleContract(tokenAbi);
                paymentContract.setProvider(this.web3Provider);
                paymentContract.web3.eth.defaultAccount = address;
                paymentContract.deployed().then(
                    (instance) => {
                        return instance.publicKeyStatus.call(address, publicKey, {
                            gas: this.GAS_LIMIT
                        });
                    }
                ).then(
                    (status) => {
                        if (status) {
                            return resolve(status);
                        }
                    }
                ).catch(
                    (error) => {
                        return reject('Error in transferEther service call');
                    }
                );
            }
        );
    }

    toUtf8(byte32) {
        return window.web3.toUtf8(byte32);
    }

    isStatusDefined(blockHash) {
        return blockHash !== '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
}