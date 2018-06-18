import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Index } from './index';
import { ExpandableList } from '../../components/expandable-list/expandable-list';

@NgModule({
    declarations: [
        Index,
        ExpandableList
    ],
    imports: [
        IonicPageModule.forChild(Index),
    ],
    exports:[
        Index
    ]
})

export class IndexModule { }
