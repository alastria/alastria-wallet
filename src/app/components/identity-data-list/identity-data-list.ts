import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Component, Input, EventEmitter, Output, OnInit, ɵConsole, Inject } from '@angular/core';

// SERVICES
import { SecuredStorageService } from '../../services/securedStorage.service';
import { AppConfig } from '../../../app.config';

// MODELS
import { Identity } from '../../models/identity.model';
import { TransactionService } from '../../services/transaction-service';
import { Web3Service } from '../../services/web3-service';
import { ModalController } from '@ionic/angular';
import { SelectIdentityPage } from 'src/app/pages/confirm-access/select-identity/select-identity';
import { getCredentialStatus } from 'src/utils';

@Component({
    selector: 'identity-data-list',
    templateUrl: 'identity-data-list.html',
    styleUrls: ['/identity-data-list.scss']
})

export class IdentityDataListComponent implements OnInit {
    @Input()
    public isSelectable = false;
    @Input()
    public allCredentials: any[];
    @Input()
    public iat: any;
    @Input()
    public exp: any;
    @Input()
    public canRevoke = false;
    @Input()
    public isPresentationRequest: boolean;
    @Input()
    public isShowDetail: boolean;

    @Output()
    public handleIdentitySelect = new EventEmitter();
    @Output()
    public loadCredential = new EventEmitter();

    public credentials: any[];
    public identityDisplay = new Array<Identity>();
    public chosenIndex: number;
    public isDataSetted = false;
    public isOrderInverted = false;

    constructor(
        private router: Router,
        private securedStrg: SecuredStorageService,
        private transactionSrv: TransactionService,
        private web3Srv: Web3Service,
        private modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
        this.parseAllCredentials();
    }

    private async parseAllCredentials(): Promise<void> {
        let iatString: any;
        let expString: any;
        let entityName: any;
        iatString = this.parseFormatDate(this.iat);
        expString = this.parseFormatDate(this.exp);
        this.credentials = this.allCredentials;
        let count = 0;
        const credentialPromises = this.credentials.map(async (credential) => {
            const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
            const level =  this.getLevelOfAssurance(credential.levelOfAssurance);
            const stars = this.createStars(level);
            const key = this.getCreedKey(credential);
            let credentialRes: Identity;

            if (this.isPresentationRequest) {
                let securedCredentials;
                const hasKey = await this.securedStrg.hasKey(AppConfig.CREDENTIAL_PREFIX + key);
                if (hasKey) {
                    const resultKey = await this.securedStrg.get(AppConfig.CREDENTIAL_PREFIX + key);
                    securedCredentials = JSON.parse(resultKey);
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], securedCredentials[key], iatString,
                        expString, securedCredentials.entityName, level, stars, true, false);
                    this.identityDisplay.push(credentialRes);
                    const credentialSelected: any = {
                        credential: this.credentials[credentialRes.id],
                        index: credentialRes.id,
                    };
                    credentialSelected.credential.credJWT = securedCredentials.credentialJWT;
                    credentialSelected.credential[key] = securedCredentials[key];
                    this.loadCredential.emit(credentialSelected);
                    return Promise.resolve();
                } else {
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], null, '',
                        'expString', '', level, stars, false, false);
                    this.identityDisplay.push(credentialRes);
                    return Promise.resolve();
                }
            } else {
                if (credential[AppConfig.ISSUER]) {
                    const entity = await this.transactionSrv.getEntity(web3, credential[AppConfig.ISSUER]);
                    // let entity = await this.transactionSrv.getEntity(credential[AppConfig.GWU], credential[AppConfig.ISSUER])
                    entityName = entity.name;
                } else {
                    entityName = credential.entityName;
                }
                iatString = this.parseFormatDate(credential[AppConfig.NBF]);
                expString = this.parseFormatDate(credential[AppConfig.EXP]);
                credentialRes = this.parseCredential(count++, key, credential[key], iatString,
                expString, entityName, level, stars, true, credential.isSelectIdentity);
                this.identityDisplay.push(credentialRes);
                return Promise.resolve();
            }
        });
        Promise.all(credentialPromises)
            .then(() => {
                this.isDataSetted = true;
                this.identityDisplay.map(identity => {
                    const event = {
                        detail: {
                            checked: true
                        }
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
                if (keyCredential !== 'levelOfAssurance' && keyCredential !== 'field_name' && keyCredential !== '@context'
                    && keyCredential !== 'exp' && keyCredential !== 'iat' && keyCredential !== 'issuer'
                    && keyCredential !== 'PSMHash' && keyCredential !== 'required' &&
                    keyCredential !== 'entityName' && keyCredential !== 'iss' && keyCredential !== 'nbf'
                    && keyCredential !== 'credentialJWT' && keyCredential !== 'sub' && keyCredential !== 'isSelectIdentity') {
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
            result = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
        }

        return result;
    }

    private getLevelOfAssurance(credentialLevel: string): number {
        let level: any = credentialLevel;
        switch (level) {
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
        const iconActive = 'iconActive';
        const iconInactive = 'iconInactive';
        const isActive = 'isActive';
        const iconStar = '../../../../assets/svg/star.svg';
        const iconStarOutline = '../../../../assets/svg/star-outline.svg';

        const stars = [{
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

    private parseCredential(id: number, title: string, value: any, addDate: string, endDate: string,
                            issuer: string, level: number, stars: Array<any>, credentialAssigned: boolean,
                            isSelectIdentity: boolean) {
        return {
            id,
            titleP: (title) ? title.toUpperCase().replace(/_/g, ' ') : '',
            emitter: 'Emisor del testimonio',
            valueT: 'Valor',
            value: (value) ? value : 'Credencial no selecionada o no disponible',
            place: 'Emisor',
            issuer,
            addDateT: 'Fecha incorporación del testimonio',
            addDate,
            endDateT: 'Fecha fin de vigencia',
            endDate,
            level: 'Nivel ' + level,
            iconsStars: stars,
            credentialAssigned,
            isExpanded: false,
            isHidden: false,
            isChecked: (isSelectIdentity) ? false : true,
        };
    }

    public async detail(item: any): Promise<void> {
        try {
            if (this.isPresentationRequest) {
                const allCredentials = await this.getAllCredentials();
                const modal = await this.modalCtrl.create({
                    component: SelectIdentityPage,
                    componentProps: {
                        allCredentials,
                        iat: this.iat,
                        exp: this.exp,
                        securedCredentials: this.credentials
                    }
                });

                await modal.present();

                const { data } = await modal.onWillDismiss();

                if (data && data.mock && data.credential) {
                    data.mock.isChecked = item.isChecked;
                    data.mock.id = item.id;
                    this.identityDisplay[item.id] = data.mock;


                    const credentialSelected: any = {
                        credential: this.credentials[item.id],
                        index: item.id
                    };
                    credentialSelected.credential.credJWT = data.credential.credentialJWT;
                    this.loadCredential.emit(credentialSelected);
                }
            } else {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        item: JSON.stringify(item),
                        showDeleteAndShare: this.canRevoke
                    }
                };

                this.router.navigate(['credential-detail'], navigationExtras);
            }
        } catch (error) {
            console.error('Detail error ', error);
        }

    }

    expandItem(item: Identity): void {
        if (item.isExpanded) {
          item.isExpanded = false;
        } else {
          this.identityDisplay.map(listItem => {
            if (item === listItem) {
              listItem.isExpanded = !listItem.isExpanded;
            } else {
              listItem.isExpanded = false;
            }
            return listItem;
          });
        }
      }

    public changeIdentitySelect(event: any, id: number): void {
        const isChecked = 'isChecked';
        const result: any = {
            id,
            value: (event && event.detail) ? event.detail.checked : false
        };

        if (event.checked || event.detail.checked) {
            result.data = this.identityDisplay[id];
            this.chosenIndex = id;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.identityDisplay.length; i++) {
                if (!this.identityDisplay[i].credentialAssigned) {
                    this.identityDisplay[i][isChecked] = null;
                }
            }
        }
        this.handleIdentitySelect.emit(result);
    }

    private async getAllCredentials() {
        const allCredentials = await this.securedStrg.getAllCredentials();
        const web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
        const promises = [];
        allCredentials.map(async cred => {
            const creedParse = JSON.parse(cred);
            promises.push(getCredentialStatus(this.transactionSrv, web3, creedParse[AppConfig.PSM_HASH], creedParse[AppConfig.ISSUER])
                .then((status) => {
                    if (parseInt(status[1], 0) !== 2) {
                        return creedParse;
                    }
                }));
        });

        return Promise.all(promises)
            .then((credentials) => {

                return credentials.filter(creed => (creed));
            });
    }
}
