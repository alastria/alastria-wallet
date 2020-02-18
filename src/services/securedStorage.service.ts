import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Platform, App } from 'ionic-angular';
import { AppConfig } from '../app.config';

@Injectable()
export class IdentitySecuredStorageService {

    securedStorageObject: SecureStorageObject;

    constructor(
        private securedStorage: SecureStorage,
        private platform: Platform
    ) {
        this.platform.ready().then(() => {
            this.initSecureStorage();
        });
    }

    private initSecureStorage() {
        this.securedStorage.create('identitySecureStorage')
            .then(
                (secStoObj: SecureStorageObject) => {
                    this.securedStorageObject = secStoObj;
                    console.log("IdentitySecureStorage ready");
                }

            );
    }

    async getKeys() {
        return this.securedStorageObject.keys();
    }

    async hasKey(key: string) {
        let keyExists = false;
        if (this.securedStorageObject) {
            return this.securedStorageObject.keys()
                .then(result => {
                    keyExists = result.some(k => { return k === key });
                    return keyExists;
                });
        }
    }

    async set(key: string, value: string) {
        return this.securedStorageObject.set(key, value);
    }

    async setDID(DID: string) {
        return this.set(AppConfig.DID, DID);
    }

    async getDID() {
        let hasDID = await this.hasKey(AppConfig.DID);
        let result = hasDID ? this.get(AppConfig.DID): null;
        return result;
    }

    async getIdentityData() {
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

    async setJSON(key: string, value: any) {
        const jsonTmp = JSON.stringify(value);
        return this.securedStorageObject.set(key, jsonTmp);
    }

    async get(key: string) {
        return this.securedStorageObject.get(key);
    }

    async remove(key: string) {
        return this.securedStorageObject.remove(key);
    }

    async clearStorage() {
        return this.securedStorageObject.clear();
    }

    async getAllCredentials() {
        let credentials;
        let keys = await this.getKeys();
        credentials = keys.filter(key => key.split('_')[0] === 'cred')
            .map(key => {
                return this.get(key);
            });

        return Promise.all(credentials);
    }

    async getJSON(key: string) {
        const jsonTmp = await this.securedStorageObject.get(key);
        return JSON.parse(jsonTmp);
    }

    async removeJson(key: string) {
        return this.securedStorageObject.remove(key);
    }

    async removePresentation(jti: string) {
        let keys = await this.getKeys();
        let regex = new RegExp(jti);

        let key = keys.filter(key => regex.test(key))

        return this.removeJson(key[0]);
    }

    async matchAndGetJSON(key: string) {
        let regex = new RegExp(key);
        let allKeys;
        let matchingKeys = new Array<string>();

        return this.getKeys()
            .then(result => {
                allKeys = result;
                console.log("All storage keys" + allKeys);
                console.log("All storage keys", allKeys);


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

    async matchPartiallyAndGetJSON(key: string) {
        let allKeys;
        let matchingKeys = new Array<string>();
        let jsonTmp = [];

        let words = key.split(" ");

        return this.getKeys()
            .then(result => {
                allKeys = result;

                for (let z = 0; z < 2; z++) {
                    let regex;
                    switch (z) {
                        case 0:
                            regex = new RegExp(key);
                            break;
                        case 1:
                            regex = new RegExp(words[words.length - 1]);
                            break;
                    }

                    let indexToSplice = new Array<Number>();
                    let count = 0;
                    for (let i = 0; i < allKeys.length; i++) {
                        if (regex.test(allKeys[i])) {
                            matchingKeys.push(allKeys[i]);
                            indexToSplice.push(i - count);
                            count++;
                        }
                    }
                    for (let i = 0; i < indexToSplice.length; i++) {
                        allKeys.splice(indexToSplice[i], 1);
                    }

                }
                for (let z = 0; z < words.length; z++) {
                    let regex;
                    if (words[z].length > 3) {
                        regex = new RegExp(words[z]);

                        for (let i = 0; i < allKeys.length; i++) {
                            if (regex.test(allKeys[i])) {
                                matchingKeys.push(allKeys[i]);
                            }
                        }
                    }

                }
                console.log(matchingKeys);

                for (let z = 0; z < matchingKeys.length; z++) {
                    jsonTmp.push(this.securedStorageObject.get(matchingKeys[z]));
                }

                return Promise.all(jsonTmp);
            })
    }
}

@Injectable()
export class SessionSecuredStorageService {

    securedStorageObject: SecureStorageObject;
    promiseState: Promise<any>;

    constructor(
        private securedStorage: SecureStorage
    ) {
    }

    initSecureStorage() {
        return this.securedStorage.create('sessionSecureStorage').then(
            (securedStorageObject) => {
                this.securedStorageObject = securedStorageObject;
            }
        );
    }

    async isRegistered() {
        return new Promise(
            async (resolve, reject) =>  {
                if (!this.securedStorageObject) {
                    this.securedStorage.create('sessionSecureStorage').then(
                        (securedStorageObject) => {
                            this.securedStorageObject = securedStorageObject;
                            this.getUsername().then(
                                (result) => {
                                    if (result) {
                                        resolve(result);
                                    }
                                    else {
                                        reject('No esta registrado, hay que crear una cuenta nueva');
                                    }
                                }
                            );
                        }
                    )
                } else {
                    const keys: any = await this.securedStorageObject.keys();
                    if (keys.includes('accessKey')) {
                        resolve(this.securedStorageObject.get('accessKey'));
                    } else {
                        this.getUsername().then(
                            (result) => {
                                if (result) {
                                    resolve(result);
                                }
                                else {
                                    reject('No esta registrado, hay que crear una cuenta nueva');
                                }
                            }
                        );
                    }
                }
            }
        )
    }

    getUsername(): Promise<any> {
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
                console.log('Falla al comprobar las keys', error);
            }
        );
    }

    async checkPassword(username: string, password: string) {
        const usernameSto = await this.securedStorageObject.get('username');
        const passwordSto = await this.securedStorageObject.get('password');

        return username === usernameSto && password === passwordSto;
    }

    register(username: string, password: any): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.getUsername().then(
                    (res) => {
                        const isRegistered = res !== null;
                        if (isRegistered) {
                            reject('El usuario ya esta registrado');
                        }
                        else {
                            this.securedStorageObject.set('username', username).then(
                                (result) => {
                                    this.securedStorageObject.set('password', password).then(
                                        (result) => {
                                            resolve();
                                        }
                                    ).catch(
                                        (error) => {
                                            reject();
                                        }
                                    );
                                }
                            ).catch(
                                (error) => {
                                    reject();
                                }
                            );
                        }
                    }
                );
            }
        )
    }

    async hasKey(key: string) {
        let keyExists = false;
        return this.securedStorageObject.keys()
            .then(result => {
                keyExists = result.some(k => { return k === key });
                return keyExists;
            });
    }

    setAccessKey(key: string): Promise<any> {
        return this.securedStorageObject.set('accessKey', key);
    }

    getAccessKey(): Promise<any> {
        return this.securedStorageObject.get('accessKey');
    }

    setLoginType(type: string) {
        return this.securedStorageObject.set('loginType', type);
    }

    getLoginType() {
        return this.securedStorageObject.get('loginType');
    }

    async isAuthorized(key: string): Promise<boolean> {
        return this.getAccessKey()
            .then((keyStore) => (parseInt(keyStore) === parseInt(key)));
    }
}
