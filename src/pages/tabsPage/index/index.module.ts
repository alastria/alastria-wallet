import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Index } from './index';
import { ExpandableListModule } from '../../../components/expandable-list/expandable-list.module';
import { ParallaxLayout1Module } from '../../../components/parallax/parallax-layout-1.module';

@NgModule({
    declarations: [
        Index
    ],
    imports: [
        IonicPageModule.forChild(Index),
        ExpandableListModule,
        ParallaxLayout1Module
    ],
    exports: [
        Index
    ]
})

export class IndexModule { }
