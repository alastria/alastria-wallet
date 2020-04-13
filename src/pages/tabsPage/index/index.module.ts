import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Index } from './index';
import { ExpandableListModule } from '../../../components/expandable-list/expandable-list.module';
import { ParallaxModule } from '../../../components/parallax/parallax.module';
import { ScrollHideDirective } from '../../../components/parallax/parallax.directive';
import { UserInfoHeaderModule } from '../../../components/user-info-header/user-info-header.module';
import { ArticleService } from '../../../services/article.service';
@NgModule({
    declarations: [
        Index,
        ScrollHideDirective
    ],
    imports: [
        IonicPageModule.forChild(Index),
        ExpandableListModule,
        UserInfoHeaderModule,
        ParallaxModule
    ],
    providers: [
        ArticleService
    ],
    exports: [
        Index
    ]
})

export class IndexModule { }
