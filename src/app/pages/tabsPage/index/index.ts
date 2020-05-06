import { Component, OnInit, OnChanges } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { Platform, NavController } from '@ionic/angular';
import { ScrollHideConfig } from '../../../components/parallax/parallax.directive';
import { ArticleService } from '../../../services/article.service';

@Component({
    templateUrl: 'index.html',
    providers: [ToastService],
    styleUrls: ['/index.scss']
})
export class IndexPage implements OnInit, OnChanges {

    params: any = {};
    data: any = {};

    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 80 };

    constructor(private toastCtrl: ToastService,
                private articleService: ArticleService,
                private platform: Platform,
                private navCtrl: NavController) {
        this.platform.backButton.subscribe(() => {
            this.navCtrl.back();
        });
    }

    ngOnInit() {
        this.getList();
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        this.params = changes.data.currentValue;
    }

    onItemClick(item: any) {
        this.toastCtrl.presentToast('Folow');
    }

    async getList() {
        try {
            this.params.data = await this.articleService.getArticles();
        } catch (error) {
            console.error('Error ', error);
        }
    }
}
