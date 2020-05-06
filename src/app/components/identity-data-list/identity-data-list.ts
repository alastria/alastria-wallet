import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

// SERVICES
import { SecuredStorageService } from '../../services/securedStorage.service';
import { AppConfig } from '../../../app.config';

// MODELS
import { Identity } from '../../models/identity.model';

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

    private isPresentationRequest: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private securedStrg: SecuredStorageService,
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.isPresentationRequest = this.router.getCurrentNavigation().extras.state[AppConfig.IS_PRESENTATION_REQ];
                this.credentials = this.router.getCurrentNavigation().extras.state[AppConfig.CREDENTIALS];
                this.iat = this.router.getCurrentNavigation().extras.state[AppConfig.IAT];
                this.exp = this.router.getCurrentNavigation().extras.state[AppConfig.EXP];
            }
        });
    }

    ngOnInit() {
        this.parseAllCredentials();
    }

    private async parseAllCredentials(): Promise<void> {
        let iatString: any;
        let expString: any;
        if (this.isManualSelection) {
            this.credentials = this.allCredentials.map(cred => JSON.parse(cred));
            iatString = this.parseFormatDate(this.iat);
            expString = this.parseFormatDate(this.exp);
        }
        let count = 0;
        const credentialPromises = this.credentials.map(async (credential) => {
            const propNames = Object.getOwnPropertyNames(credential);

            const level =  this.getLevelOfAssurance(credential.levelOfAssurance);
            const stars = this.createStars(level);

            let credentialRes: Identity;

            if (this.isPresentationRequest) {
                let securedCredentials;
                const key = credential[AppConfig.FIELD_NAME];
                const hasKey = await this.securedStrg.hasKey(AppConfig.CREDENTIAL_PREFIX + key);
                if (hasKey) {
                    const resultKey = await this.securedStrg.get(AppConfig.CREDENTIAL_PREFIX + key);
                    securedCredentials = JSON.parse(resultKey);
                    credentialRes = this.parseCredential(count++, credential[AppConfig.FIELD_NAME], securedCredentials[key], iatString,
                        expString, level, stars, true);

                    this.identityDisplay.push(credentialRes);
                    const credentialSelected: any = {
                        credential: this.credentials[credentialRes.id],
                        index: credentialRes.id
                    };
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
                credentialRes = this.parseCredential(count++, propNames[1], credential[propNames[1].toString()], iatString,
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
            result = newDate.getDay() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
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
        const iconStar = 'icon-star';
        const iconStarOutline = 'icon-star-outline';

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

    private parseCredential(id: number, title: string, value: any, addDate: string,
                            endDate: string, level: number, stars: Array<any>, credentialAssigned: boolean) {

        return {
            id,
            titleP: (title) ? title.toUpperCase().replace(/_/g, ' ') : '',
            emitter: 'Emisor del testimonio',
            valueT: 'Valor',
            value: (value) ? value : 'Credencial no selecionada o no disponible',
            place: 'Emisor de credencial',
            addDateT: 'Fecha incorporación del testimonio',
            addDate,
            endDateT: 'Fecha fin de vigencia',
            endDate,
            level: 'Nivel ' + level,
            iconsStars: stars,
            credentialAssigned,
            isExpanded: false,
            isHidden: false,
            isChecked: true
        };
    }

    public async detail(item: any): Promise<void> {
        try {
            if (this.isPresentationRequest) {
                const credentials = await this.securedStrg.getAllCredentials();

                new Promise((resolve) => {
                    const navigationExtras: NavigationExtras = {
                        state: {
                            item,
                            isManualSelection: true,
                            allCredentials: credentials,
                            iat: this.iat,
                            exp: this.exp,
                            resolve
                        }
                    };
                    this.router.navigate(['/', 'selectIdentity'], navigationExtras);
                }).then((data: any) => {
                    if (data.mock && data.credential) {
                        data.mock.isChecked = item.isChecked;
                        data.mock.id = item.id;
                        this.identityDisplay[item.id] = data.mock;
                        const result: any = {
                            credential: data.credential,
                            index: item.id
                        };
                        this.loadCredential.emit(result);
                    }
                });
            } else {
                const navigationExtras: NavigationExtras = {
                    state: {
                      item
                    }
                };
                this.router.navigate(['/', 'credentialDetail', navigationExtras]);
            }
        } catch (error) {
            console.error('Detail error ', error);
        }

    }

    public expandCredential(item: Identity) {
        item.isExpanded = !item.isExpanded;
    }

    public changeIdentitySelect(event: any, id: number): void {
        const isChecked = 'isChecked';
        const result: any = {
            id,
            value: event.checked
        };

        if (this.isManualSelection) {
            if (event.checked) {
                result.data = this.identityDisplay[id];
                this.chosenIndex = id;
                for (let i = 0; i < this.identityDisplay.length; i++) {
                    if (i !== id) {
                        this.identityDisplay[i][isChecked] = null;
                    }
                }
            }
        }
        this.handleIdentitySelect.emit(result);
    }
}
