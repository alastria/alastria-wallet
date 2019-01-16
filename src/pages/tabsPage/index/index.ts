import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { TabsService } from '../../../services/tabs-service';
import { IonicPage } from 'ionic-angular/umd';
import { ScrollHideConfig } from '../../../components/parallax/parallax.directive';

@IonicPage({
    defaultHistory: ['TabsPage']
})
@Component({
    templateUrl: 'index.html',
    providers: [TabsService, ToastService]
})
export class Index {

    params: any = {};
    data: any = {};
    searchTerm: string = "Buscar";

    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 80 };

    constructor(private toastCtrl: ToastService) {
        console.log("[Debug] Index enter");
        this.getList();
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        this.params = changes['data'].currentValue;
    }

    onItemClick(item: any) {
        this.toastCtrl.presentToast("Folow");
    }

    getList() {
        this.params.data = [
            {
                "backgroundImage": "assets/images/alastria/basicos.png",
                "title": "Datos básicos",
                "description": "Tus datos más valiosos bajo tu control: tu dirección, tu fecha de nacimiento, tu email...",
                "link": "page-contructions"
            },
            {
                "backgroundImage": "assets/images/alastria/salud.png",
                "title": "Salud",
                "description": "Aquí puedes encontrar tus datos sanitarios, tu historial de vacunación o tus recetas médicas ",
                "link": "page-contructions"
            },
            {
                "backgroundImage": "assets/images/alastria/finanzas.png",
                "title": "Finanzas",
                "description": "Añade tus datos de titularidad de tus cuentas corrientes u otros datos financieros.",
                "link": "page-contructions"
            },
            {
                "backgroundImage": "assets/images/alastria/estudios.png",
                "title": "Estudios",
                "description": "Añade tus datos académicos, tanto si ya has finalizado tus estudios como si aún estás en ello.",
                "link": "page-contructions"
            }
        ];
    }
}
