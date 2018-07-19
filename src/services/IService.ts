import { NavController } from 'ionic-angular';

export interface IService {
  getAllThemes(): Array<any>;
  getTitle(): string;
  getId(): string;
  getEventsForTheme(menuItem: any, navCtrl: NavController): Array<any>;
  prepareParams(menuItem: any, navCtrl: NavController): any;
  load(menuItem: any): any;
}
