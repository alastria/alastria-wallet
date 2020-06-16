import { CredentialDetailPage } from '../../pages/credential-detail/credential-detail';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { SecuredStorageService } from '../../services/securedStorage.service';
import { SelectIdentity } from '../../pages/confirm-access/select-identity/select-identity'
import { AppConfig } from '../../app.config';
import { Identity } from '../../models/identity.model'
import { TransactionService } from '../../services/transaction-service';
import { Web3Service } from '../../services/web3-service';

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
    @Input()
    public canRevoke = false;

    @Output()
    public handleIdentitySelect = new EventEmitter();
    @Output()
    public loadCredential = new EventEmitter();

    public credentials: any[];
    public identityDisplay = new Array<Identity>();
    public chosenIndex: number;
    public isDataSetted = false;
    public isOrderInverted = false;

    private isPresentationRequest: Boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private securedStrg: SecuredStorageService,
        private transactionSrv: TransactionService,
        private web3Srv: Web3Service
    ) {
    }

    ngOnInit() {
        this.isPresentationRequest = this.navParams.get(AppConfig.IS_PRESENTATION_REQ);
        this.parseAllCredentials();
    }

    private async parseAllCredentials(): Promise<void> {
        let iatString: any; 
        let expString: any;
        let entityName: any;
        if (this.isManualSelection) {
            this.credentials = this.allCredentials.map(cred => JSON.parse(cred));
            iatString = this.parseFormatDate(this.iat);
            expString = this.parseFormatDate(this.exp);
        } else {
            this.credentials = this.navParams.get(AppConfig.CREDENTIALS);
        }
        let count = 0;
        let credentialPromises = this.credentials.map(async (credential) => {
            const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL)
            let level =  this.getLevelOfAssurance(credential.levelOfAssurance)
            let stars = this.createStars(level);
            let key = this.getCreedKey(credential);
            let credentialRes: Identity;

            if (this.isPresentationRequest) {
                let securedCredentials;
                let hasKey = await this.securedStrg.hasKey(AppConfig.CREDENTIAL_PREFIX + key);
                if (hasKey) {
                    const resultKey = await this.securedStrg.get(AppConfig.CREDENTIAL_PREFIX + key)
                    securedCredentials = JSON.parse(resultKey);
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], securedCredentials[key], iatString,
                        expString, securedCredentials.entityName, level, stars, true);
                    this.identityDisplay.push(credentialRes);
                    const credentialSelected: any = {
                        credential: this.credentials[credentialRes.id],
                        index: credentialRes.id
                    }
                    credentialSelected.credential.credJWT = securedCredentials['credentialJWT']
                    credentialSelected.credential[key] = securedCredentials[key];
                    this.loadCredential.emit(credentialSelected);
                    return Promise.resolve();
                } else {
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], null, '',
                        'expString', '', level, stars, false);
                    this.identityDisplay.push(credentialRes);
                    return Promise.resolve();
                }
            } else {
                if(credential[AppConfig.ISSUER]) {
                    let entity = await this.transactionSrv.getEntity(web3, credential[AppConfig.ISSUER])
                    // let entity = await this.transactionSrv.getEntity(credential[AppConfig.GWU], credential[AppConfig.ISSUER])
                    entityName = entity.name
                } else {
                    entityName = credential.entityName
                }
                iatString = this.parseFormatDate(credential[AppConfig.NBF]);
                expString = this.parseFormatDate(credential[AppConfig.EXP]);
                credentialRes = this.parseCredential(count++, key, credential[key], iatString,
                expString, entityName, level, stars, true);
                this.identityDisplay.push(credentialRes);
                return Promise.resolve();
            }
        });
        if (this.isManualSelection) {
            this.identityDisplay.sort();
        }
        Promise.all(credentialPromises)
            .then(() => {
                this.isDataSetted = true;
                this.identityDisplay.map(identity => {
                    const event = {
                        checked: true
                    };
                    this.changeIdentitySelect(event, identity.id);
                });
            });
    }

    private getCreedKey(credential: any) {
        let key = '';
        Object.keys(credential).map((keyCredential) => {
            if (this.isPresentationRequest) {
                key = credential[AppConfig.FIELD_NAME];
            } else {
                if (keyCredential !== 'levelOfAssurance' && keyCredential !== 'field_name' && keyCredential !== '@context' && keyCredential !== 'exp' && 
                    keyCredential !== 'iat' && keyCredential !== 'issuer' && keyCredential !== 'PSMHash' && keyCredential !== 'required' && 
                    keyCredential !== 'entityName' && keyCredential !== 'iss' && keyCredential !== 'nbf' && keyCredential !== 'credentialJWT' && keyCredential !== 'sub') {
                    key = keyCredential;
                }
            }
        });

        return key;
    }

    private parseFormatDate(date: any): string {
        let result = '';
        if (date) {
            const newDate = new Date(date); 
            result = newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear();
        }

        return result;
    }

    private getLevelOfAssurance(credentialLevel: string): number{
        let level: any = credentialLevel;
        switch (level){
            case AppConfig.LevelOfAssurance.Self:
                level = 0;
                break;
            case AppConfig.LevelOfAssurance.Low:
                level = 1;
                break;
            case AppConfig.LevelOfAssurance.Substantial:
                level = 2;
                break;
            case AppConfig.LevelOfAssurance.High:
                level = 3;
                break;
        }

        return level;
    }

    private createStars(level: number): Array<any> {
        let iconActive = "iconActive";
        let iconInactive = "iconInactive";
        let isActive = "isActive";
        let iconStar = "icon-star";
        let iconStarOutline = "icon-star-outline";

        let stars = [{
            [iconActive]: iconStar,
            [iconInactive]: iconStarOutline,
            [isActive]: true
        }, {
            [iconActive]: iconStar,
            [iconInactive]: iconStarOutline,
            [isActive]: true
        }, {
            [iconActive]: iconStar,
            [iconInactive]: iconStarOutline,
            [isActive]: true
        }];

        for (let z = 0; z < stars.length; z++) {
            stars[z].isActive = ((z + 1 <= level) ? true : false);
        }

        return stars;
    }

    private parseCredential(id: number, title: string, value: any, addDate: string, endDate: string, issuer: string, level: number, stars: Array<any>, credentialAssigned: boolean) {
        return {
            id: id,
            titleP: (title) ? title.toUpperCase().replace(/_/g, " ") : '',
            emitter: "Emisor del testimonio",
            valueT: "Valor",
            value: (value) ? value : "Credencial no selecionada o no disponible",
            place: "Emisor",
            issuer: issuer,
            addDateT: "Fecha incorporación del testimonio",
            addDate: addDate,
            endDateT: "Fecha fin de vigencia",
            endDate: endDate,
            level: "Nivel " + level,
            iconsStars: stars,
            credentialAssigned: credentialAssigned,
            isExpanded: false,
            isHidden: false,
            isChecked: true
        };
    }

    public async detail(item: any): Promise<void> {
        try {
            if (this.isPresentationRequest) {
                const credentials = await this.securedStrg.getAllCredentials()
                let iat = this.navParams.get(AppConfig.IAT);
                let exp = this.navParams.get(AppConfig.EXP);
    
                new Promise((resolve) => {
                    this.navCtrl.push(SelectIdentity, {
                        item,
                        isManualSelection: true,
                        allCredentials: credentials,
                        iat,
                        exp,
                        resolve
                    });
                }).then((data: any) => {
                    if (data.mock && data.credential) {
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
            } else {
                this.navCtrl.push(CredentialDetailPage, { item, showDeleteAndShare: this.canRevoke });
            }
        } catch (error) {
            console.error('Detail error ', error);
        }
        
    }

    public expandCredential(item: Identity) {
        item.isExpanded = !item.isExpanded;
    }

    public changeIdentitySelect(event: any, id: number): void {
        let isChecked = "isChecked";
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
                        this.identityDisplay[i][isChecked] = null;
                    }
                }
            }
        }
        this.handleIdentitySelect.emit(result);
    }
}
