import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { ContructionsPage } from '../contructions/contructions';
import { RegisterForm } from '../register/register-hub/register-form/register-form';

@IonicPage()
@Component({
    selector: 'page-walkthrough',
    templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {

    @ViewChild(Slides) slidesTo: Slides;

    slides = [
        {
            title: "Tu identidad, tus datos, siempre contigo gracias a Blockchain",
            description: "Aquí tenemos que explicar las bondades de la solucion de AlastriaID y qué aporta Blockchain.",
            image: "assets/images/alastria/slide1.png",
        },
        {
            title: "Accede a tus servicios de manera cómoda y segura",
            description: "Aquí tenemos que explicar las bondades de la solucion de AlastriaID.",
            image: "assets/images/alastria/slide2.png",
        },
        {
            title: "Tan sencillo como hacer una foto con tu móvil",
            description: "Aquí tenemos que explicar las bondades de la solucion de AlastriaID.",
            image: "assets/images/alastria/slide3.png",
        }
    ];

    slideEnd = [
        {
            title: "Tú decides qué datos compartes",
            description: "Aquí tenemos que explicar las bondades de la solucion de AlastriaID.",
            image: "assets/images/alastria/slide4.png",
        }
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WalkthroughPage');
    }

    goToSlide() {
        this.slidesTo.slideNext();
    }

    navegateTo(text: string) {
        if (text === 'register-form') {
            this.navCtrl.setRoot(RegisterForm);
        }
        else {
            let modal = this.modalCtrl.create(ContructionsPage);
            modal.present();
        }
        console.log('Navigating to page: ' + text);
    }
}
