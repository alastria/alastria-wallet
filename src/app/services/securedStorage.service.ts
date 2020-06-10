import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { AppConfig } from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class SecuredStorageService {

    securedStorageObject: SecureStorageObject;
    promiseState: Promise<any>;

    constructor(
        private securedStorage: SecureStorage
    ) {
    }

    initSecureStorage(): Promise<void> {
        return this.securedStorage.create('identitySecureStorage').then(
            (securedStorageObject) => {
            this.securedStorageObject = securedStorageObject;
            }
        );
    }

    // GETTERS

    async get(key: string): Promise<any> {
        let result = null;
        const hasKey = await this.hasKey(key);
        if (hasKey) {
            result = await this.securedStorageObject.get(key);
        }

        return result;
    }

    getAccessKey(): Promise<string> {
        return this.securedStorageObject.get('accessKey');
    }

    getKeys(): Promise<Array<any>> {
        return this.securedStorageObject.keys();
    }

    async getUsername(): Promise<any> {
        return this.securedStorageObject.keys().then(
            (str) => {
                if (str.length > 0 && str.indexOf('username') > -1) {
                    return this.securedStorageObject.get('username');
                } else {
                    return null;
                }
            },
        ).catch(
            (error) => {
                console.error('Falla al comprobar las keys', error);
            }
        );
    }

    getLoginType(): Promise<any> {
        return this.securedStorageObject.get('loginType');
    }

    async getIdentityData(): Promise<any> {
        let identity = {};
        return this.get(AppConfig.USER_DID)
        .then(DID => {
            identity[AppConfig.USER_DID] = DID;
            return this.get(AppConfig.USER_PKU);
        })
        .then(PKU => {
            identity[AppConfig.USER_PKU] = PKU;
            return this.get(AppConfig.USER_PRIV_KEY);
        })
        .then(privKey => {
            identity[AppConfig.USER_PRIV_KEY] = privKey;
            return identity;
        })
    }

    async getAllCredentials(): Promise<Array<any>> {
        let credentials: Array<any>;
        let keys = await this.getKeys();
        credentials = keys.filter(key => key.split('_')[0] === 'cred')
            .map(key => {
                return this.get(key);
            });

        return Promise.all(credentials);
    }

    async getJSON(key: string): Promise<any> {
        const jsonTmp = await this.securedStorageObject.get(key);
        return JSON.parse(jsonTmp);
    }

    // SETTERS

    set(key: string, value: string): Promise<any> {
        return this.securedStorageObject.set(key, value);
    }

    setAccessKey(key: string): Promise<any> {
        return this.securedStorageObject.set('accessKey', key);
    }

    setLoginType(type: string): Promise<any> {
        return this.securedStorageObject.set('loginType', type);
    }

    async isAuthorized(key: string): Promise<boolean> {
        return this.getAccessKey()
            .then((keyStore) => (parseInt(keyStore) === parseInt(key)));
    }

    setDID(DID: string): Promise<any> {
        return this.set(AppConfig.DID, DID);
    }

    setJSON(key: string, value: any): Promise<any> {
        const jsonTmp = JSON.stringify(value);
        return this.securedStorageObject.set(key, jsonTmp);
    }

    // REMOVE

    remove(key: string): Promise<any> {
        return this.securedStorageObject.remove(key);
    }

    clearStorage(): Promise<any> {
        return this.securedStorageObject.clear();
    }

    removeJson(key: string): Promise<any> {
        return this.securedStorageObject.remove(key);
    }

    async removePresentation(jti: string): Promise<any> {
        let keys = await this.getKeys();
        let regex = new RegExp(jti);

        let key = keys.filter(key => regex.test(key))

        return this.removeJson(key[0]);
    }

    // CHECKERS

    async hasKey(key: string): Promise<boolean> {
        let keyExists = false;
        if (this.securedStorageObject) {
            return this.securedStorageObject.keys()
                .then(result => {
                    keyExists = result.some(k => { return k === key });
                    return keyExists;
                });
        }
    }

    // OTHERS

    async matchAndGetJSON(key: string): Promise<any> {
        let regex = new RegExp(key);
        let allKeys;
        let matchingKeys = new Array<string>();

        return this.getKeys()
            .then(result => {
                allKeys = result;
                for (let i = 0; i < allKeys.length; i++) {
                    if (regex.test(allKeys[i])) {
                        matchingKeys.push(allKeys[i]);
                    }
                }
                let promises = [];
                for (let z = 0; z < matchingKeys.length; z++) {
                    promises.push(this.securedStorageObject.get(matchingKeys[z])
                        .then(currentKey => {
                            let keyObj = JSON.parse(currentKey);
                            keyObj[AppConfig.REMOVE_KEY] = matchingKeys[z];
                            return JSON.stringify(keyObj);
                        }))
                }

                return Promise.all(promises);
            });
    }
}
