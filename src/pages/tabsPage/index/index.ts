import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { IonicPage } from 'ionic-angular/umd';
import { ScrollHideConfig } from '../../../components/parallax/parallax.directive';
import { ArticleService } from '../../../services/article.service';

@IonicPage({
    defaultHistory: ['TabsPage']
})
@Component({
    templateUrl: 'index.html',
    providers: [ToastService]
})
export class Index {

    params: any = {};
    data: any = {};

    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 80 };

    constructor(private toastCtrl: ToastService,
                private articleService: ArticleService) {
        console.log("[Debug] Index enter");
    }

    ngOnInit(){
        this.getList();
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        this.params = changes['data'].currentValue;
    }

    onItemClick(item: any) {
        this.toastCtrl.presentToast("Folow");
    }

    async getList() {
        try {
            this.params.data = await this.articleService.getArticles();
        } catch (error) {
            console.error('Error ', error);
        }
    }
}
