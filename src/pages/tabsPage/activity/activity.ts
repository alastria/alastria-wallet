import { ModalController, NavController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';

// MODELS
import { ActivityM } from './../../../models/activity.model';
import { AppConfig } from '../../../app.config';

// COMPONENTS - PAGES
import { OptionsComponent } from './options/options';

// SERVICES
import { SecuredStorageService } from '../../../services/securedStorage.service';
import { TransactionService } from '../../../services/transaction-service';
import { ToastService } from '../../../services/toast-service';
import { ActivitiesService } from '../../../services/activities.service';
import { Web3Service } from '../../../services/web3-service';
import { CredentialDetailPage } from '../../credential-detail/credential-detail';
import { LoadingService } from '../../../services/loading-service';


@IonicPage()
@Component({
    templateUrl: 'activity.html',
    providers: [ToastService]
})

export class Activity {

    @ViewChild(OptionsComponent)
    public optionsComponent: OptionsComponent;

    public activities: Array<ActivityM>;
    public searchTerm: string;
    public type: string;
    public activitiesSelected: Array<any> = new Array<any>();
    public selection: boolean = false;
    public web3: any

    constructor(private toastCtrl: ToastService,
        private activitiesService: ActivitiesService,
        private securedStrg: SecuredStorageService,
        private transactionSrv: TransactionService,
        private navCtrl: NavController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public web3Srv: Web3Service,
        private loadingSrv: LoadingService
    ) {
        this.type = AppConfig.CREDENTIAL_TYPE;
        this.getActivities()
            .then((activities) => {
                this.activities = activities;
            });
        this.web3 = this.web3Srv.getWeb3(AppConfig.nodeURL)
    }

    ionViewWillEnter() {
        this.getActivities()
        .then((activities) => {
            this.activities = activities;
        });
    }

    /**
     * Function for get activities
    */
   public getActivities() {
        let prefix: string;
        if (this.type === AppConfig.CREDENTIAL_TYPE) {
            prefix = AppConfig.CREDENTIAL_PREFIX;
        } else {
            prefix = AppConfig.PRESENTATION_PREFIX;
        }

        return this.securedStrg.matchAndGetJSON(prefix)
            .then(async (elements) => {
                let count = 0;
                const promises = [];
                const did = await this.securedStrg.get('userDID');
                elements.map(async (element) => {
                    const elementObj = JSON.parse(element);
                    const key = this.getCreedKey(elementObj)

                    if (prefix === AppConfig.CREDENTIAL_PREFIX) {
                        promises.push(this.getCredentialStatus(this.web3, elementObj[AppConfig.PSM_HASH], did)
                        .then((credentialStatus) => {
                            const statusType = parseInt(credentialStatus[1]);

                            return this.createActivityObject(count++, key, elementObj[key], elementObj.entityName, elementObj.iat,
                                statusType, elementObj[AppConfig.REMOVE_KEY]);
                        }));
                    } else {
                        const iat = new Date(elementObj[AppConfig.PAYLOAD][AppConfig.NBF]);
                        const iatString = iat.getDate() + "/" + (iat.getMonth() + 1) + "/" + iat.getFullYear();
                        
                        promises.push(this.getPresentationStatus(this.web3, elementObj[AppConfig.PSM_HASH], did)
                        .then(async (credentialStatus) => {
                            const title = `${elementObj[AppConfig.PAYLOAD][AppConfig.JTI]}`;
                            // const title = "Presentación " + count++;
                            const statusType = parseInt(credentialStatus[1]);
                            const entityName = await this.transactionSrv.getEntity(this.web3, elementObj[AppConfig.PAYLOAD][AppConfig.AUDIENCE])
                            
                            return this.createActivityObject(count++, title, '', entityName.name, iatString, statusType, elementObj[AppConfig.REMOVE_KEY]);
                        }));
                    }
                });

                return Promise.all(promises);
            });
    }
    private getCreedKey(credential: any) {
        let key = '';
        Object.keys(credential).map((keyCredential) => {
            if (keyCredential !== 'levelOfAssurance' && keyCredential !== 'iat' && keyCredential !== 'exp' && keyCredential !== 'iss' && 
            keyCredential !== 'entityName' && keyCredential !== 'PSMHash' && keyCredential !== 'removeKey' && keyCredential !== 'nbf' && 
            keyCredential !== 'credentialJWT' && keyCredential !== 'sub') {
                key = keyCredential;
            }
        });

        return key;
    }

    /**
     * Go item click  
     * @param {*} item - activity selected
    */
    async onItemClick(item: any) {
        if (item.type === AppConfig.PRESENTATION_TYPE){
            let presentation = await this.securedStrg.getJSON(item.removeKey);

            let entityName;
            if(presentation[AppConfig.PAYLOAD][AppConfig.AUDIENCE]) {
                let issuer = presentation[AppConfig.PAYLOAD][AppConfig.AUDIENCE];
                let entity = await this.transactionSrv.getEntity(this.web3, issuer);
                //let entity = await this.transactionSrv.getEntity(presentation[AppConfig.PAYLOAD][AppConfig.GWU], presentation[AppConfig.PAYLOAD][AppConfig.ISSUER])
                entityName = entity.name
            } else {
                entityName = presentation.entityName
            }
            let iatString = this.parseFormatDate(presentation[AppConfig.PAYLOAD][AppConfig.NBF]);
            let expString = this.parseFormatDate(presentation[AppConfig.PAYLOAD][AppConfig.EXP]);
            let credentialRes = this.parseCredential(0, item.title, entityName, iatString,
            expString, entityName, 3, this.createStars(3), true);
            //Send credentialRes to creadential detail.
            this.navCtrl.push(CredentialDetailPage, {PSMHash: presentation[AppConfig.PSM_HASH], item: credentialRes, showDeleteAndShare: true, 
                isRevoked: item.status == AppConfig.ActivityStatus.Revoked || item.status == AppConfig.ActivityStatus.DeletedBySubject });
        } else {
            this.toastCtrl.presentToast("Folow");
        }
    }

    async getEntity(web3: any, issuer: string) {
        const entity = await this.transactionSrv.getEntity(web3, issuer)
        return entity.name
    }

    /**
     * Search activities fake
     * @param {string} event
     * @param {*} item
    */
    async onSearch(event?: any) {
        let searchTerm = this.searchTerm;
        if (event) {
            searchTerm = event.target.value;
        }

        try {
            this.activities = await this.getActivities();
            if (searchTerm) {
                this.activities = this.activities.filter(activity => {
                    if (activity.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
                        || activity.subtitle.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
                        || activity.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                        return activity;
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    private parseFormatDate(date: any): string {
        let result = '';
        if (date) {
            const newDate = new Date(date); 
            result = newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear();
        }

        return result;
    }

    private parseCredential(id: number, title: string, value: any, addDate: string, endDate: string, issuer: string, level: number, stars: Array<any>, credentialAssigned: boolean) {
        return {
            id: id,
            titleP: (title) ? title.replace(/_/g, " ") : '',
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

    /**
     * Function that listens when change the segment
    */
    segmentChanged(event: any): void {
        this.resetSelection();
        this.onSearch();
    }

    /**
     * Force change of selectAll variable
    */
    forceChangeSelectAll(): void {
        if (this.optionsComponent) {
            if (this.activitiesSelected && this.activitiesSelected.length) {
                if (this.activities && this.activities.length === this.activitiesSelected.length) {
                    let isSelectAllActivities = true;
                    for (let i = 0, length = this.activitiesSelected.length; i < length; i++) {
                        if (!this.activitiesSelected[i]) {
                            isSelectAllActivities = false;
                        }
                    }
                    if (isSelectAllActivities) {
                        this.optionsComponent.isSelectAll = true;
                    } else {
                        this.optionsComponent.isSelectAll = null;
                    }
                }
            }
        }
    }

    /**
     * Function for select item, change style and activate options
     * @param {number} index
     * @param {*} activity - item selected
    */
    selectActivity(index: number, activity: any): void {
        this.selection = true;
        if (this.activitiesSelected && this.activitiesSelected.length && this.activitiesSelected[index]) {
            this.activitiesSelected[index] = undefined;
            let unselectAll = true;
            this.activitiesSelected.forEach(activityId => {
                if (activityId) {
                    unselectAll = false;
                }
            });
            if (unselectAll) {
                this.resetSelection();
            }
        } else {
            this.activitiesSelected[index] = activity.activityId;
        }

        this.forceChangeSelectAll();
    }

    /**
     * Function that listening if 'selectAll' checkbox in options component, if true then select all activities
     * @param {boolean} isSelectAll
    */
    handleSelectAll(isSelectAll: boolean): void {
        if (isSelectAll) {
            this.activities.forEach((activity, i) => {
                if (!this.activitiesSelected[i]) {
                    this.activitiesSelected[i] = activity.activityId;
                }
            })
        } else {
            if (isSelectAll !== null) {
                this.resetSelection();
            }
        }
    }

    /**
     * Function that listening if delete or backup click in options component
     * @param {string} type - delete or backup
    */
    handleDeleteOrBackup(type: string, isPresentation): void {
        const deleteType = 'delete';
        let title = '';
        let message = '';
        if (type.toLowerCase() === deleteType.toLowerCase() && !isPresentation) {
            title = 'Borrar actividades';
            message = '¿Estas seguro de eliminar las actividades seleccionadas?';
        } else {
            title = 'Revocar presentacion';
            message = '¿Estas seguro de que quieres revocar esta presentación? El proveedor deberá borrar las credenciales de esta presentación si solicitas la revocación.';
        }
        this.showConfirm(title, message, type);
    }

    /**
     * Show alert for confirm delete or backup of the activities selected
     * @param {string} title - title of alert
     * @param {string} message - message of alert
     * @param {string} type - delete or backup
    */
    showConfirm(title: string, message: string, type: string): void {
        const deleteType = 'delete';
        const confirm = this.alertCtrl.create({
            title,
            message,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Eliminar',
                    handler: () => {
                        if (type.toLowerCase() === deleteType.toLowerCase()) {
                            this.deleteActivities(this.activitiesSelected);
                        } else {
                            this.backupActivities(this.activitiesSelected);
                        }
                    }
                }
            ]
        });
        confirm.present();
    }

    resetSelection(): void {
        this.selection = false;
        this.activitiesSelected = [];
    }

    private async createActivityObject(activityId: number, title: string, subtitle: string, description: string, dateTime: any, statusType: number, removeKey: string) {
        let auxArray = ["Valid", "AskIssuer", "Revoked", "DeletedBySubject"];
        return {
            "activityId": activityId,
            "title": (title) ? title.toUpperCase().replace(/_/g, " ") : '',
            "subtitle": subtitle,
            "description": description,
            "datetime": dateTime,
            "type": this.type,
            "status": AppConfig.ActivityStatus[auxArray[statusType]],
            "removeKey": removeKey,
        }
    }

    private async getCredentialStatus(web3: any, psmHash: string, did: string) {
        let status = await this.transactionSrv.getSubjectPresentationStatus(web3, did, psmHash);

        return status;
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
    
    private async getPresentationStatus(web3: any, psmHash: string, did: string) {
        let status = await this.transactionSrv.getSubjectPresentationStatus(web3, did, psmHash);

        return status;
    }

    /**
     * Function that call service for delete activities selected
     * @param {Array<number>} ids - ids of the activities selected
    */
    async deleteActivities(ids: Array<number>): Promise<void> {
        try {
            let keysToRemove;
            let messageSuccess;
            const messageSuccessCred = 'Se han borrado las actividades correctamente';
            const messageSuccessPresent = 'Se han revocado las actividades correctamente';
            this.loadingSrv.showModal()
            if (this.type === AppConfig.CREDENTIAL_TYPE) {
                keysToRemove = ids.map(element => {
                    return this.activities[element][AppConfig.REMOVE_KEY];
                }).map(key => {
                    return this.securedStrg.removePresentation(key);
                });
                messageSuccess = messageSuccessCred

                keysToRemove = Promise.all(keysToRemove)
            } else {
                keysToRemove = ids.reduce(
                    (prevVal, element, i) => {
                        return prevVal.then(() => {
                            if (element && this.activities[i].status !== AppConfig.ActivityStatus.Revoked){
                                return this.securedStrg.getJSON(this.activities[i][AppConfig.REMOVE_KEY])
                                .then(presentation => this.revokePresentation(presentation[AppConfig.PSM_HASH]))
                            }
                        });
                    },
                    Promise.resolve());
                
                messageSuccess = messageSuccessPresent
            }
            
            keysToRemove
            .then(async () => {
                this.loadingSrv.updateModalState();
                this.resetSelection();
                this.activities = await this.getActivities();
                return this.getActivities();
            })
            .then(() => {
                // this.toastCtrl.presentToast(messageSuccess);
            });
            
        } catch(error) {
            this.loadingSrv.hide();
            console.error('error delete activities ', error);
        }
    }

    /**
     * Function that call service for backuo activities selected
     * @param {Array<number>} ids - ids of the activities selected
    */
    async backupActivities(ids: Array<number>): Promise<void> {
        const messageSuccess = 'Se ha realizado el backup correctamente';
        try {
            await this.activitiesService.backupActivities(ids);
            this.resetSelection();
            this.toastCtrl.presentToast(messageSuccess);
        } catch (err) {
            console.error('backupActivities ', err);
        }
    }

    private async revokePresentation(PSMHash) {
        return this.transactionSrv.revokeSubjectPresentation(this.web3, PSMHash);
    }
}
