import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TransactionService } from '../../services/transaction-service';
import { Web3Service } from '../../services/web3-service';
import { AppConfig } from '../../../app.config';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast-service';
import { LoadingService } from 'src/app/services/loading-service';

@Component({
    selector: 'credential-detail-page',
    templateUrl: 'credential-detail.html',
    styleUrls: ['/credential-detail.scss']
})
export class CredentialDetailPage implements OnInit {

    private title = 'Revocar presentacion';
    // tslint:disable-next-line: max-line-length
    private message = '¿Estas seguro de que quieres revocar esta presentación? El proveedor deberá borrar las credenciales de esta presentación si solicitas la revocación.';

    data: any;
    public showDeleteAndShare: boolean;
    public isRevoked: boolean;

    private PSMHash: string;
    private web3;

    constructor(
        public activatedRoute: ActivatedRoute,
        private transactionSrv: TransactionService,
        private web3Srv: Web3Service,
        private alertCtrl: AlertController,
        private toastCtrl: ToastService,
        private loadingSrv: LoadingService,
        private navController: NavController
    ) {
        this.web3 = this.web3Srv.getWeb3(AppConfig.nodeURL);
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.data = (params.item) ? JSON.parse(params.item) : {};
            this.PSMHash = params.PSMHash;
            this.isRevoked = (params.isRevoked) ? JSON.parse(params.isRevoked) : false;
            this.showDeleteAndShare = (params.showDeleteAndShare) ?  JSON.parse(params.showDeleteAndShare) : false;
        });
    }

    public async showConfirm() {
        const confirm = await this.alertCtrl.create({
            header: this.title,
            message: this.message,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
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
        await confirm.present();
    }

    private async revokePresentation() {
        try {
            this.loadingSrv.showModal();
            await this.transactionSrv.revokeSubjectPresentation(this.web3, this.PSMHash);
            this.isRevoked = true;
            this.loadingSrv.hide();
            this.toastCtrl.presentToast('La presentación se ha revocado!');
        } catch (error) {
            this.loadingSrv.hide();
            this.toastCtrl.presentToast('Ha ocurrido un error');
        }
    }
}
