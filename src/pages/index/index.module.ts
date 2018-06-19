import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Index } from './index';
import { ExpandableListModule } from '../../components/expandable-list/expandable-list.module';

@NgModule({
    declarations: [
        Index
    ],
    imports: [
        IonicPageModule.forChild(Index),
        ExpandableListModule
    ],
    exports:[
        Index
    ]
})

export class IndexModule { }
