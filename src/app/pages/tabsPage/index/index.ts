import { MessageManagerService } from './../../../services/messageManager-service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { Platform, NavController } from '@ionic/angular';
import { ScrollHideConfig } from '../../../components/parallax/parallax.directive';
import { ArticleService } from '../../../services/article.service';
import { Observable } from 'rxjs';

// Model
import { ArticleModel } from 'src/app/models/article.model';
import { share } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: 'index.html',
    providers: [ToastService],
    styleUrls: ['/index.scss']
})
export class IndexPage implements OnInit, OnChanges {

    articles: Observable<Array<ArticleModel>>;
    data: any = {};

    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 80 };

    constructor(private toastCtrl: ToastService,
                private articleService: ArticleService,
                private platform: Platform,
                private navCtrl: NavController,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private messageManagerService: MessageManagerService) {
        this.platform.backButton.subscribe(() => {
            this.navCtrl.back();
        });
        this.articles = this.getArticles().pipe();

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params.token) {
                this.messageManagerService.prepareDataAndInit(params.token, true);
                this.router.navigate([], {queryParams: {token: null}, queryParamsHandling: 'merge'});
            }
        });
    }

    ngOnInit() {
    }

    ngOnChanges(changes: { [propKey: string]: any }) {
        // this.params = changes.data.currentValue;
    }

    onItemClick(item: any) {
        this.toastCtrl.presentToast('Folow');
    }

    getArticles(): Observable<Array<ArticleModel>> {
        try {
            return this.articleService.getArticles();
        } catch (error) {
            console.error('Error ', error);
        }
    }
}
