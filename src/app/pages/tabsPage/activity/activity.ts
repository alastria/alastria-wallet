import { Component, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

// MODELS
import { ActivityM } from './../../../models/activity.model';
import { AppConfig } from '../../../../app.config';

// COMPONENTS - PAGES
import { OptionsComponent } from './options/options';

// SERVICES
import { SecuredStorageService } from '../../../services/securedStorage.service';
import { TransactionService } from '../../../services/transaction-service';
import { ToastService } from '../../../services/toast-service';
import { ActivitiesService } from '../../../services/activities.service';

@Component({
    templateUrl: 'activity.html',
    providers: [ToastService]
})

export class ActivityPage {

    @ViewChild(OptionsComponent, {read: '', static: false})
    public optionsComponent: OptionsComponent;

    public activities: Array<ActivityM>;
    public searchTerm: string;
    public type: string;
    public activitiesSelected: Array<any> = new Array<any>();
    public selection = false;

    constructor(private toastCtrl: ToastService,
                private activitiesService: ActivitiesService,
                private securedStrg: SecuredStorageService,
                private transactionSrv: TransactionService,
                public alertCtrl: AlertController,
                public modalCtrl: ModalController
    ) {
        this.type = AppConfig.CREDENTIAL_TYPE;
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
                const did = await this.securedStrg.getDID();
                elements.map(async (element) => {
                    const elementObj = JSON.parse(element);
                    const elementKeys = Object.getOwnPropertyNames(elementObj);

                    if (prefix === AppConfig.CREDENTIAL_PREFIX) {
                        promises.push(this.getCredentialStatus(elementObj[AppConfig.PSM_HASH], did)
                            .then((credentialStatus) => {
                                // tslint:disable-next-line: radix
                                const statusType = parseInt(credentialStatus[1]);

                                return this.createActivityObject(count++, elementKeys[1], elementObj[elementKeys[1]], elementObj.issuer,
                                    '', statusType, elementObj[AppConfig.REMOVE_KEY]);
                            }));
                    } else {
                        const iat = new Date(elementObj[AppConfig.PAYLOAD][AppConfig.IAT] * 1000);
                        const iatString = iat.getDay() + '/' + (iat.getMonth() + 1) + '/' + iat.getFullYear();
                        const title = 'Presentación ' + count;

                        promises.push(this.getPresentationStatus(elementObj[AppConfig.PSM_HASH], did)
                            .then((credentialStatus) => {
                                // tslint:disable-next-line: radix
                                const statusType = parseInt(credentialStatus[1]);

                                return this.createActivityObject(count++, title, '', elementObj[AppConfig.PAYLOAD][AppConfig.ISSUER],
                                    iatString, statusType, elementObj[AppConfig.REMOVE_KEY]);
                            }));
                    }
                });

                return Promise.all(promises);
            });
    }

    /**
     * Go item click
     * @param item - activity selected
     */
    onItemClick(item: any): void {
        this.toastCtrl.presentToast('Folow');
    }

    /**
     * Search activities fake
     * @param event - *
     * @param item - *
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
     * @param index - *
     * @param activity - item selected
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
     * @param isSelectAll - *
     */
    handleSelectAll(isSelectAll: boolean): void {
        if (isSelectAll) {
            this.activities.forEach((activity, i) => {
                if (!this.activitiesSelected[i]) {
                    this.activitiesSelected[i] = activity.activityId;
                }
            });
        } else {
            if (isSelectAll !== null) {
                this.resetSelection();
            }
        }
    }

    /**
     * Function that listening if delete or backup click in options component
     * @param type - delete or backup
     */
    handleDeleteOrBackup(type: string): void {
        const deleteType = 'delete';
        let title = '';
        let message = '';
        if (type.toLowerCase() === deleteType.toLowerCase()) {
            title = 'Borrar actividades';
            message = '¿Estas seguro de eliminar las actividades seleccionadas?';
        } else {
            title = 'Backup de actividades';
            message = '¿Estas seguro de hacer un backup de las actividades seleccionadas?';
        }
        this.showConfirm(title, message, type);
    }

    /**
     * Show alert for confirm delete or backup of the activities selected
     * @param title - title of alert
     * @param message - message of alert
     * @param type - delete or backup
     */
    async showConfirm(title: string, message: string, type: string): Promise<void> {
        const deleteType = 'delete';
        const alert = await this.alertCtrl.create({
            header: title,
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
        await alert.present();
    }

    resetSelection(): void {
        this.selection = false;
        this.activitiesSelected = [];
    }

    private createActivityObject(activityId: number, title: string, subtitle: string, description: string,
                                 datetime: any, statusType: number, removeKey: string): ActivityM {
        const auxArray = ['Valid', 'AskIssuer', 'Revoked', 'DeletedBySubject'];

        return {
            activityId,
            title,
            subtitle,
            description,
            datetime,
            type: this.type,
            status: AppConfig.ActivityStatus[auxArray[statusType]],
            removeKey,
        };
    }

    private async getCredentialStatus(psmHash: string, did: string) {
        const status = await this.transactionSrv.getSubjectPresentationStatus(did.split(':')[4], psmHash);

        return status;
    }

    private async getPresentationStatus(psmHash: string, did: string) {
        const status = await this.transactionSrv.getSubjectPresentationStatus(did.split(':')[4], psmHash);

        return status;
    }

    /**
     * Function that call service for delete activities selected
     * @param ids - ids of the activities selected
     */
    async deleteActivities(ids: Array<number>): Promise<void> {
        try {
            const messageSuccess = 'Se han borrado las actividades correctamente';
            let prefix: string;
            if (this.type === AppConfig.CREDENTIAL_TYPE) {
                prefix = AppConfig.CREDENTIAL_PREFIX;
            } else {
                prefix = AppConfig.PRESENTATION_PREFIX;
            }

            const keysToRemove = ids.map(element => {
                if (prefix === AppConfig.CREDENTIAL_PREFIX) {
                    return this.activities[element][AppConfig.REMOVE_KEY];
                } else {
                    return this.activities[element][AppConfig.JTI];
                }
            }).map(key => {
                    return this.securedStrg.removePresentation(key);
                });

            Promise.all(keysToRemove)
                .then(async () => {
                    this.activities = await this.getActivities();
                    return this.getActivities();
                })
                .then(() => {
                    this.resetSelection();
                    this.toastCtrl.presentToast(messageSuccess);
                });
        } catch (error) {
            console.error('error delete activities ', error);
        }
    }

    /**
     * Function that call service for backuo activities selected
     * @param ids - ids of the activities selected
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
}
