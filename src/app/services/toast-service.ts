import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private toastCtrl: ToastController) {}

  async presentToast(message: string, milis = 1000) {
    const toastItem = {
      duration: 1000,
      position: 'buttom',
      message: ''
    };
    toastItem.message = message;
    const toast = await this.toastCtrl.create({message, duration: milis});

    return await toast.present();
  }
}
