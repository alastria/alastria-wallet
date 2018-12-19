import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Injectable()
export class SecuredStorageService {

    securedStorageObject: SecureStorageObject;

    constructor(
        private securedStorage: SecureStorage
    ) {
        this.securedStorage.create('secureStorageName2')
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