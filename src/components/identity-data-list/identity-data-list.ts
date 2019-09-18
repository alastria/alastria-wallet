import { DetailProfilePage } from './../../pages/detail-profile/detail-profile';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';
import { SelectIdentity } from '../../pages/confirm-access/select-identity/select-identity';

export interface mockCredential {
    id: number,
    titleP: string,
    emitter: string,
    place: string,
    valueT: string,
    value: string,
    addDateT: string,
    addDate: string,
    endDateT: string,
    endDate: string,
    level: string,
    iconsStars: Array<any>,
    credentialAssigned: boolean,
    isExpanded: boolean
}

@Component({
    selector: 'identity-data-list',
    templateUrl: 'identity-data-list.html'
})

export class IdentityDataListComponent {
    @Input()
    public isSelectable = false;

    @Output()
    public handleIdentitySelect = new EventEmitter();
    @Output()
    public loadCredential = new EventEmitter();

    public credentials: any[];
    public identityDisplay = new Array<mockCredential>();
    public identityData = new Array<mockCredential>();
    public chosenIndex: number;
    public isDataSetted = false;

    private readonly CREDENTIAL_PREFIX = "cred_";
    private isPresentationRequest: Boolean;
    private isManualSelection: Boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private securedStrg: IdentitySecuredStorageService
    ) {
        this.isPresentationRequest = this.navParams.get("isPresentationRequest");
        this.isManualSelection = this.navParams.get("isManualSelection");
        if (this.isManualSelection) {
            this.credentials = this.navParams.get("allCredentials");
        } else {
            this.credentials = this.navParams.get("credentials");
        }

        let iat = new Date(this.navParams.get("iat") * 1000);
        let exp = new Date(this.navParams.get("exp") * 1000);
        let iatString = iat.getDay() + "/" + (iat.getMonth() + 1) + "/" + iat.getFullYear();
        let expString = exp.getDay() + "/" + (exp.getMonth() + 1) + "/" + exp.getFullYear();
        let count = 0;

        let credentialPromises = this.credentials.map((credential) => {
            let propNames = Object.getOwnPropertyNames(credential);

            let level = credential.levelOfAssurance;

            let stars = [{
                "iconActive": "icon-star",
                "iconInactive": "icon-star-outline",
                "isActive": true
            }, {
                "iconActive": "icon-star",
                "iconInactive": "icon-star-outline",
                "isActive": true
            }, {
                "iconActive": "icon-star",
                "iconInactive": "icon-star-outline",
                "isActive": true
            }];

            for (let z = 0; z < stars.length; z++) {
                stars[z].isActive = ((z + 1 <= level) ? true : false);
            }

            let obj: mockCredential;

            if (this.isPresentationRequest) {
                let securedCredentials;
                let key = credential["field_name"];
                return this.securedStrg.hasKey(this.CREDENTIAL_PREFIX + key)
                    .then(result => {
                        if (result) {
                            return this.securedStrg.get(this.CREDENTIAL_PREFIX + key)
                                .then((result) => {
                                    console.log(result);
                                    securedCredentials = JSON.parse(result);
                                    obj = {
                                        id: count++,
                                        titleP: credential[propNames[2].toString()],
                                        emitter: "Emisor del testimonio",
                                        valueT: "Valor",
                                        value: securedCredentials[key],
                                        place: "Emisor de credencial",
                                        addDateT: "Fecha incorporación del testimonio",
                                        addDate: iatString,
                                        endDateT: "Fecha fin de vigencia",
                                        endDate: expString,
                                        level: "Nivel " + level,
                                        iconsStars: stars,
                                        credentialAssigned: true,
                                        isExpanded: false
                                    };
                                    this.identityDisplay.push(obj);
                                    return Promise.resolve();
                                });
                        } else {
                            obj = {
                                id: count++,
                                titleP: credential[propNames[2].toString()],
                                emitter: "Emisor del testimonio",
                                valueT: "Valor",
                                value: "Credencial no selecionada o no disponible",
                                place: "Emisor de credencial",
                                addDateT: "Fecha incorporación del testimonio",
                                addDate: "",
                                endDateT: "",
                                endDate: "",
                                level: "Nivel " + level,
                                iconsStars: stars,
                                credentialAssigned: false,
                                isExpanded: false
                            };
                            this.identityDisplay.push(obj);
                            return Promise.resolve();
                        }
                    });
            } else {
                obj = {
                    id: count++,
                    titleP: propNames[2].toUpperCase(),
                    emitter: "Emisor del testimonio",
                    valueT: "Valor",
                    value: credential[propNames[2].toString()],
                    place: "Emisor de credencial",
                    addDateT: "Fecha incorporación del testimonio",
                    addDate: iatString,
                    endDateT: "Fecha fin de vigencia",
                    endDate: expString,
                    level: "Nivel " + level,
                    iconsStars: stars,
                    credentialAssigned: true,
                    isExpanded: false
                };
                this.identityDisplay.push(obj);
                return Promise.resolve();
            }
        });
        if (this.isManualSelection) {
            this.identityDisplay.sort();
            this.identityData = this.identityDisplay;
        }
        Promise.all(credentialPromises)
            .then(() => {
                this.isDataSetted = true;
            });
    }

    public detail(item: any): void {
        if (this.isPresentationRequest) {
            this.securedStrg.getAllCredentials()
                .then((credentials: any) => {
                    console.log('getAllCredentials: ', this.identityDisplay);
                    let allCredentials = credentials.map((credential) => JSON.parse(credential));
                    let iat = this.navParams.get("iat");
                    let exp = this.navParams.get("exp");

                    new Promise((resolve) => {
                        this.navCtrl.push(SelectIdentity, {
                            item,
                            isManualSelection: true,
                            allCredentials,
                            iat,
                            exp,
                            resolve
                        })
                    }).then((data: any) => {
                        if (data.mock && data.credential) {
                            console.log("Manual credential: ", data.credential)
                            data.mock.isChecked = item.isChecked
                            data.mock.id = item.id;
                            this.identityDisplay[item.id] = data.mock;
                            const result: any = {
                                credential: data.credential,
                                index: item.id
                            }
                            this.loadCredential.emit(result);
                        }
                    });
                });
        } else {
            this.navCtrl.push(DetailProfilePage, { item });
        }
    }

    public expandCredential(item: mockCredential) {
        item.isExpanded = !item.isExpanded;
    }

    public changeIdentitySelect(event: any, id: number): void {
        console.log(event);
        const result: any = {
            id,
            value: event.checked
        }
        if (this.isManualSelection) {
            if (event.checked) {
                result.data = this.identityDisplay[id];
                this.chosenIndex = id;
                for (let i = 0; i < this.identityDisplay.length; i++) {
                    if (i != id) {
                        this.identityDisplay[i]['isChecked'] = null;
                    }
                }
                this.handleIdentitySelect.emit(result);
            } else if (this.chosenIndex === id) {
                this.handleIdentitySelect.emit(result);
            }
        }
        else {
            this.handleIdentitySelect.emit(result);
        }
    }
}
