import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings'

@Injectable()
export class ToastService {

  constructor(private toastCtrl: ToastController) {}

  presentToast(message: string) {
    let toastItem = AppSettings.TOAST;
    toastItem["message"] = message;
    let toast = this.toastCtrl.create(toastItem);
    toast.present();
  }
}
