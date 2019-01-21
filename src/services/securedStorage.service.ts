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
            (resolve, reject) => {
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
}
