import { DetailProfilePage } from './../../pages/detail-profile/detail-profile';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { IdentitySecuredStorageService } from '../../services/securedStorage.service';
import { SelectIdentity } from '../../pages/confirm-access/select-identity/select-identity';
import { JsonPipe } from '@angular/common';

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
    isExpanded: boolean,
    isHidden: boolean
}

@Component({
    selector: 'identity-data-list',
    templateUrl: 'identity-data-list.html'
})

export class IdentityDataListComponent {
    @Input()
    public isSelectable = false;
    @Input()
    public allCredentials: any[];
    @Input()
    public isManualSelection: boolean;
    @Input()
    public iat: any;
    @Input()
    public exp: any;

    @Output()
    public handleIdentitySelect = new EventEmitter();
    @Output()
    public loadCredential = new EventEmitter();

    public credentials: any[];
    public identityDisplay = new Array<mockCredential>();
    public chosenIndex: number;
    public isDataSetted = false;
    public isOrderInverted = false;
    private readonly CREDENTIAL_PREFIX = "cred_";
    private isPresentationRequest: Boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private securedStrg: IdentitySecuredStorageService
    ) {

    }

    ngOnInit() {
        this.isPresentationRequest = this.navParams.get("isPresentationRequest");
        console.log("ISMANUALSELECTION", this.isManualSelection);
        console.log("CREDENTIALS " + JSON.stringify(this.allCredentials));
        let iat: any;
        let exp: any;
        let iatString: any; 
        let expString: any;
        if (this.isManualSelection) {
            console.log("ESTOY " + this.allCredentials);
            
            this.credentials = this.allCredentials.map(cred => JSON.parse(cred));
            iat = new Date(this.iat * 1000);
            exp = new Date(this.exp * 1000);
            iatString = iat.getDay() + "/" + (iat.getMonth() + 1) + "/" + iat.getFullYear();
            expString = exp.getDay() + "/" + (exp.getMonth() + 1) + "/" + exp.getFullYear();
        } else {
            console.log("MEFUI");
            this.credentials = this.navParams.get("credentials");
            iat = new Date(this.navParams.get("iat") * 1000);
            exp = new Date(this.navParams.get("exp") * 1000);
            iatString = iat.getDay() + "/" + (iat.getMonth() + 1) + "/" + iat.getFullYear();
            expString = exp.getDay() + "/" + (exp.getMonth() + 1) + "/" + exp.getFullYear();
        }
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
                                        isExpanded: false,
                                        isHidden: false
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
                                isExpanded: false,
                                isHidden: false
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
                    isExpanded: false,
                    isHidden: false
                };
                this.identityDisplay.push(obj);
                return Promise.resolve();
            }
        });
        if (this.isManualSelection) {
            this.identityDisplay.sort();
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
                    
    
                    let iat = this.navParams.get("iat");
                    let exp = this.navParams.get("exp");
                    console.log('CREDENTIALDETAIL: ' + JSON.stringify(credentials));

                    new Promise((resolve) => {
                        this.navCtrl.push(SelectIdentity, {
                            item,
                            isManualSelection: true,
                            allCredentials: credentials,
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
