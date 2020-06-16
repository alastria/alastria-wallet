import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController } from 'ionic-angular';
import { TransactionService } from '../../services/transaction-service';
import { Web3Service } from '../../services/web3-service';
import { AppConfig } from '../../app.config';

@IonicPage()
@Component({
    selector: 'credential-detail-page',
    templateUrl: 'credential-detail.html',
})
export class CredentialDetailPage {

    private title = 'Revocar presentacion';
    private message = '¿Estas seguro de que quieres revocar esta presentación? El proveedor deberá borrar las credenciales de esta presentación si solicitas la revocación.';

    data: any;
    public showDeleteAndShare: boolean;
    public isRevoked: boolean;

    private PSMHash: string;
    private web3;

    constructor(
        public navParams: NavParams,
        private transactionSrv: TransactionService,
        private web3Srv: Web3Service,
        private alertCtrl: AlertController
    ) {
        this.web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
    }

    ngOnInit() {
        this.data = this.navParams.get('item');
        this.PSMHash = this.navParams.get('PSMHash');
        this.isRevoked = this.navParams.get('isRevoked');
        this.showDeleteAndShare = this.navParams.get('showDeleteAndShare');
    }

    public showConfirm() {
        const confirm = this.alertCtrl.create({
            title: this.title,
            message: this.message,
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
                        this.revokePresentation();
                    }
                }
            ]
        });
        confirm.present();
    }

    private async revokePresentation() {
        let result = await this.transactionSrv.revokeSubjectPresentation(this.web3, this.PSMHash);
        this.isRevoked = true;
        console.log(result);
    }
}
