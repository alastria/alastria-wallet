import { CredentialDetailPage } from '../../pages/credential-detail/credential-detail';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { SecuredStorageService } from '../../services/securedStorage.service';
import { SelectIdentity } from '../../pages/confirm-access/select-identity/select-identity'
import { AppConfig } from '../../app.config';
import { Identity } from '../../models/identity.model'

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
    public identityDisplay = new Array<Identity>();
    public chosenIndex: number;
    public isDataSetted = false;
    public isOrderInverted = false;

    private isPresentationRequest: Boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private securedStrg: SecuredStorageService,
    ) {
    }

    ngOnInit() {
        this.isPresentationRequest = this.navParams.get(AppConfig.IS_PRESENTATION_REQ);
        this.parseAllCredentials();
    }

    private async parseAllCredentials(): Promise<void> {
        let iatString: any; 
        let expString: any;
        if (this.isManualSelection) {
            this.credentials = this.allCredentials.map(cred => JSON.parse(cred));
            iatString = this.parseFormatDate(this.iat);
            expString = this.parseFormatDate(this.exp);
        } else {
            this.credentials = this.navParams.get(AppConfig.CREDENTIALS);
        }
        let count = 0;
        let credentialPromises = this.credentials.map(async (credential) => {
            let level =  this.getLevelOfAssurance(credential.levelOfAssurance)
            let stars = this.createStars(level);

            let credentialRes: Identity;

            if (this.isPresentationRequest) {
                let securedCredentials;
                let key = credential[AppConfig.FIELD_NAME];
                let hasKey = await this.securedStrg.hasKey(AppConfig.CREDENTIAL_PREFIX + key);
                if (hasKey) {
                    const resultKey = await this.securedStrg.get(AppConfig.CREDENTIAL_PREFIX + key)
                    securedCredentials = JSON.parse(resultKey);
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], securedCredentials[key], iatString,
                        expString, level, stars, true);

                    this.identityDisplay.push(credentialRes);
                    const credentialSelected: any = {
                        credential: this.credentials[credentialRes.id],
                        index: credentialRes.id
                    }
                    credentialSelected.credential[key] = securedCredentials[key];
                    this.loadCredential.emit(credentialSelected);
                    return Promise.resolve();
                } else {
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], null, '',
                        'expString', level, stars, false);
                    this.identityDisplay.push(credentialRes);
                    return Promise.resolve();
                }
            } else {                
                iatString = this.parseFormatDate(credential[AppConfig.IAT]);
                expString = this.parseFormatDate(credential[AppConfig.EXP]);
                const title = credential[AppConfig.FIELD_NAME]
                    credentialRes = this.parseCredential(count++, title, credential[title], iatString,
                    expString, level, stars, true);
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

    private parseFormatDate(date: any): string {
        let result = '';
        if (date) {
            const newDate = new Date(date); 
            result = newDate.getDay() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear();
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

    private parseCredential(id: number, title: string, value: any, addDate: string, endDate: string, level: number, stars: Array<any>, credentialAssigned: boolean) {

        return {
            id: id,
            titleP: (title) ? title.toUpperCase().replace(/_/g, " ") : '',
            emitter: "Emisor del testimonio",
            valueT: "Valor",
            value: (value) ? value : "Credencial no selecionada o no disponible",
            place: "Emisor de credencial",
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
                this.navCtrl.push(CredentialDetailPage, { item });
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
