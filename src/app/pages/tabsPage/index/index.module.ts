import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexPage } from './index';
import { ExpandableListModule } from '../../../components/expandable-list/expandable-list.module';
import { ParallaxModule } from '../../../components/parallax/parallax.module';
import { ScrollHideDirective } from '../../../components/parallax/parallax.directive';
import { UserInfoHeaderModule } from '../../../components/user-info-header/user-info-header.module';
import { ArticleService } from '../../../services/article.service';

@NgModule({
    declarations: [
        IndexPage,
        ScrollHideDirective
    ],
    imports: [
        ExpandableListModule,
        UserInfoHeaderModule,
        ParallaxModule,
        CommonModule
    ],
    entryComponents: [
        IndexPage,
    ],
    providers: [
        ArticleService
    ],
    exports: [
        IndexPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IndexModule { }
