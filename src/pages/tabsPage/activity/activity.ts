/** dependencies */
import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
/** Services */
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { Activities } from './../../../services/activities/activities.service';
/** Model */
import { ActivityM } from './../../../models/activity.model';
/** Components */
import { OptionsComponent } from './options/options';

@IonicPage()
@Component({
  templateUrl: 'activity.html',
  providers: [TabsService, ToastService]
})
export class Activity {

  @ViewChild(OptionsComponent) optionsComponent: OptionsComponent;
  activities: Array<ActivityM>;
  searchTerm: string;
  type = "all";
  activitiesSelected: Array<any> = new Array<any>();
  selection: boolean = false;

  constructor(private toastCtrl: ToastService,
              private activitiesService: Activities,
              public alertCtrl: AlertController) {
    this.getActivities();
  }

  /**
   * Go item click  
   * @param {*} item - activity selected
  */
  onItemClick(item: any): void {
    this.toastCtrl.presentToast("Folow");
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
      await this.getActivities();
      if (searchTerm) {
        this.activities = this.activities.filter(activity => {
          if (activity.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 
            || activity.subtitle.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 
            || activity.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            return activity;
          }
        });
      }
    } catch(err) {
      console.log(err);
    }
  }

  /**
   * Function that listens when change the segment
  */
  segmentChanged(event: any): void {
    this.resetSelection();
    this.onSearch();
    //this.getActivities();
  }

  /**
   * Force change of selectAll variable
  */
  forceChangeSelectAll(): void  {
    if (this.optionsComponent) {
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
  selectActivity(index: number, activity: any): void  {
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
  handleSelectAll(isSelectAll: boolean): void  {
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
  handleDeleteOrBackup(type: string): void  {
    const deleteType = 'delete';
    let title = '';
    let message = '';
    if (type.toLowerCase() === deleteType.toLowerCase()) {
      title = 'Borrar actividades';
      message = '¿Estas seguro de borrar las actividades seleccionadas?';
    } else {
      title = 'Backup de actividades';
      message = '¿Estas seguro de hacer un backup de las actividades seleccionadas?';
    }
    this.showConfirm(title, message, type);
  }

  /**
   * Show alert for confirm delete or backup of the activities selected
   * @param {string} title - title of alert
   * @param {string} message - message of alert
   * @param {string} type - delete or backup
  */
  showConfirm(title: string, message: string, type: string): void  {
    const deleteType = 'delete';
    const confirm = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
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

  resetSelection(): void  {
    this.selection = false;
    this.activitiesSelected = [];
  }

  /**
   * Function for get activities
  */
  async getActivities() {
    try {
      const res: any = await this.activitiesService.getActivities(this.type);
      this.activities = res.data;
    } catch(e) {
      console.log( 'error ', e);
    }
  }

  /**
   * Function that call service for delete activities selected
   * @param {Array<number>} ids - ids of the activities selected
  */
  async deleteActivities(ids: Array<number>) {
    const messageSuccess = 'Se han borrado las actividades correctamente';
    try {
      const res = await this.activitiesService.deleteActivities(ids, this.activities);
      this.activities = res.data;
      this.resetSelection();
      this.toastCtrl.presentToast(messageSuccess);
    } catch(err) {
      console.log(err);
    }
  }

  /**
   * Function that call service for backuo activities selected
   * @param {Array<number>} ids - ids of the activities selected
  */
  async backupActivities(ids: Array<number>) {
    const messageSuccess = 'Se ha realizado el backup correctamente';
    try {
      await this.activitiesService.backupActivities(ids);
      this.resetSelection();
      this.toastCtrl.presentToast(messageSuccess);
    } catch(err) {
      console.log(err);
    }
  }
}
