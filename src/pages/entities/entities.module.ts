import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntitiesPage } from './entities';
import { TabsModule } from '../../components/tabs/tabs.module';

@NgModule({
  declarations: [
    EntitiesPage,
  ],
  imports: [
    IonicPageModule.forChild(EntitiesPage),
    TabsModule
  ],
})
export class EntitiesPageModule {}
