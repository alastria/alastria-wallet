import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Index } from './index';
import { ExpandableListModule } from '../../../components/expandable-list/expandable-list.module';
import { ParallaxLayout1Module } from '../../../components/parallax/parallax-layout-1.module';
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
        ParallaxLayout1Module
    ],
    providers: [
        ArticleService
    ],
    exports: [
        Index
    ]
})

export class IndexModule { }
