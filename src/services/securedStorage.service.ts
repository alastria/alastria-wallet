import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Injectable()
export class IdentitySecuredStorageService {

    securedStorageObject: SecureStorageObject;

    constructor(
        private securedStorage: SecureStorage
    ) {
        this.securedStorage.create('identitySecureStorage')
            .then(
                (secStoObj: SecureStorageObject) => {
                    this.securedStorageObject = secStoObj;
                }
            );
    }

    async getKeys() {
        return this.securedStorageObject.keys();
    }

    async set(key: string, value: string) {
        return this.securedStorageObject.set(key, value);
    }

    async setJSON(key: string, value: any) {
        const jsonTmp = JSON.stringify(value);
        return this.securedStorageObject.set(key, jsonTmp);
    }

    async get(key: string) {
        return this.securedStorageObject.get(key);
    }

    async getJSON(key: string) {
        const jsonTmp = await this.securedStorageObject.get(key);
        return JSON.parse(jsonTmp);
    }

}

@Injectable()
export class SessionSecuredStorageService {

    securedStorageObject: SecureStorageObject;
    promiseState: Promise<any>;

    constructor(
        private securedStorage: SecureStorage
    ) {
        this.securedStorage.create('sessionSecureStorage').then(
            (securedStorageObject) => {
                this.securedStorageObject = securedStorageObject;
            }
        );
    }

    async isRegistered() {
        return new Promise(
            (next) => {
                this.securedStorageObject.get('username').then(
                    (str) => {
                        next(str);
                    }
                );
            }
        )
    }

    getUsername() {
        return this.securedStorageObject.get('username');
    }

    async checkPassword(username: string, password: string) {
        const usernameSto = await this.securedStorageObject.get('username');
        const passwordSto = await this.securedStorageObject.get('password');

        return username === usernameSto && password === passwordSto;
    }

    async register(username: string, password: any) {
        const isRegistered = (await this.getUsername()) !== undefined;
        if (isRegistered) {
            throw new Error('User already registered');
        }
        this.securedStorageObject.set('username', username);
        this.securedStorageObject.set('password', password);
    }

}