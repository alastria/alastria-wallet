import { IService } from './IService';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app-settings'
import { LoadingService } from './loading-service'
import { ToastService } from './toast-service';

@Injectable()
export class TabsService implements IService {

  constructor(private loadingService: LoadingService, private toastCtrl: ToastService) { }

  getId = (): string => 'tabs';

  getTitle = (): string => 'Tabs';

  getAllThemes = (): Array<any> => {
    return [
      { "title": "Footer tab - text", "theme": "layout1" },
      { "title": "Footer tab - icons", "theme": "layout2" },
      { "title": "Header tab - text", "theme": "layout3" }
    ];
  };

  getDataForTheme = (menuItem: any): Array<any> => {
    return this[
      'getDataFor' +
      menuItem.charAt(0).toUpperCase() +
      menuItem.slice(1)
    ]();
  };

  /** Settings Tabs Footer tab - text  **/

  getDataForTab1 = (): any => {
    return {
      "items": [
        {
          "title": "Rachel	McGrath",
          "subtitle": "@rachel.mcgrath",
          "follow": "follow",
          "avatar": "assets/images/avatar/1.jpg"
        },
        {
          "title": "Claire	Johnston",
          "subtitle": "@claire.johnston",
          "follow": "follow",
          "avatar": "assets/images/avatar/2.jpg"
        },
        {
          "title": "Ella	Chapman",
          "subtitle": "@ella.chapman",
          "follow": "follow",
          "avatar": "assets/images/avatar/3.jpg"
        },
        {
          "title": "Una	Davies",
          "subtitle": "@una.davies",
          "follow": "follow",
          "avatar": "assets/images/avatar/4.jpg"
        },
        {
          "title": "Natalie	Forsyth",
          "subtitle": "@natalie.forsyth",
          "follow": "follow",
          "avatar": "assets/images/avatar/6.jpg"
        },
        {
          "title": "Deirdre	Bond",
          "subtitle": "@deirdre.bond",
          "follow": "follow",
          "avatar": "assets/images/avatar/5.jpg"
        },
        {
          "title": "Claire	Metcalfe",
          "subtitle": "@claire.metcalfe",
          "follow": "follow",
          "avatar": "assets/images/avatar/7.jpg"
        }
      ]
    };
  }

  getDataForTab2 = (): any => {
    return {
      "items": [
        {
          "title": "Caroline	Hodges",
          "subtitle": "@caroline.hodges",
          "follow": "follow",
          "avatar": "assets/images/avatar/8.jpg"
        },
        {
          "title": "Natalie	Mitchell",
          "subtitle": "@natalie.mitchell",
          "follow": "follow",
          "avatar": "assets/images/avatar/9.jpg"
        },
        {
          "title": "Amy	Marshall",
          "subtitle": "@amy.marshall",
          "follow": "follow",
          "avatar": "assets/images/avatar/10.jpg"
        },
        {
          "title": "Deirdre	Bell",
          "subtitle": "@deirdre.bell",
          "follow": "follow",
          "avatar": "assets/images/avatar/11.jpg"
        },
        {
          "title": "Bernadette	Kelly",
          "subtitle": "@bernadette.kelly",
          "follow": "follow",
          "avatar": "assets/images/avatar/12.jpg"
        },
        {
          "title": "Jan	Black",
          "subtitle": "@jan.black",
          "follow": "follow",
          "avatar": "assets/images/avatar/13.jpg"
        },
        {
          "title": "Joan	Parr",
          "subtitle": "@joan.parr",
          "follow": "follow",
          "avatar": "assets/images/avatar/14.jpg"
        }
      ]
    };
  }

  getDataForTab3 = (): any => {
    return {
      "items": [
        {
          "title": "Victoria	Pullman",
          "subtitle": "@victoria.pullman",
          "follow": "follow",
          "avatar": "assets/images/avatar/15.jpg"
        },
        {
          "title": "Lauren	Cameron",
          "subtitle": "@lauren.cameron",
          "follow": "follow",
          "avatar": "assets/images/avatar/16.jpg"
        },
        {
          "title": "Rachel	McGrath",
          "subtitle": "@rachel.mcgrath",
          "follow": "follow",
          "avatar": "assets/images/avatar/17.jpg"
        },
        {
          "title": "Claire	Johnston",
          "subtitle": "@claire.johnston",
          "follow": "follow",
          "avatar": "assets/images/avatar/18.jpg"
        },
        {
          "title": "Ella	Chapman",
          "subtitle": "@ella.chapman",
          "follow": "follow",
          "avatar": "assets/images/avatar/19.jpg"
        },
        {
          "title": "Natalie	Forsyth",
          "subtitle": "@natalie.forsyth",
          "follow": "follow",
          "avatar": "assets/images/avatar/20.jpg"
        },
        {
          "title": "Caroline	Hodges",
          "subtitle": "@caroline.hodges",
          "follow": "follow",
          "avatar": "assets/images/avatar/21.jpg"
        }
      ]
    };
  }

  getDataForTab4 = (): any => {
    return {
      "items": [
        {
          "title": "Deirdre	Bell",
          "subtitle": "@deirdre.bell",
          "follow": "follow",
          "avatar": "assets/images/avatar/22.jpg"
        },
        {
          "title": "Bernadette	Kelly",
          "subtitle": "@bernadette.kelly",
          "follow": "follow",
          "avatar": "assets/images/avatar/23.jpg"
        },
        {
          "title": "Yvonne	Parsons",
          "subtitle": "@yvonne.parsons",
          "follow": "follow",
          "avatar": "assets/images/avatar/24.jpg"
        },
        {
          "title": "Joan	Parr",
          "subtitle": "@joan.parr",
          "follow": "follow",
          "avatar": "assets/images/avatar/1.jpg"
        }
      ]
    };
  }

  getDataForTab5 = (): any => {
    return {
      "items": [
        {
          "title": "Leah	Parr",
          "subtitle": "@leah.parr",
          "follow": "follow",
          "avatar": "assets/images/avatar/2.jpg"
        },
        {
          "title": "Megan	Wallace",
          "subtitle": "@megan.wallace",
          "follow": "follow",
          "avatar": "assets/images/avatar/3.jpg"
        },
        {
          "title": "Ella	Hodges",
          "subtitle": "@ella.hodges",
          "follow": "follow",
          "avatar": "assets/images/avatar/4.jpg"
        },
        {
          "title": "Jan	Roberts",
          "subtitle": "@jan.roberts",
          "follow": "follow",
          "avatar": "assets/images/avatar/5.jpg"
        }
      ]
    };
  }

  /** Settings Tabs Footer tab - icons  **/

  getDataForTab6 = (): any => {
    return {
      "items": [
        {
          "price": "$13.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/1.jpg"
        },
        {
          "price": "$32.06",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/2.jpg"
        },
        {
          "price": "$45.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/3.jpg"
        },
        {
          "price": "$13.69",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/4.jpg"
        },
        {
          "price": "$3.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/6.jpg"
        },
      ]
    };
  }

  getDataForTab7 = (): any => {
    return {
      "items": [
        {
          "price": "$40.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/6.jpg"
        },
        {
          "price": "$46.60",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/7.jpg"
        },
        {
          "price": "$13.05",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/8.jpg"
        },
        {
          "price": "$22.56",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/9.jpg"
        },
        {
          "price": "$23.22",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/10.jpg"
        },
      ]
    };
  }

  getDataForTab8 = (): any => {
    return {
      "items": [
        {
          "price": "$53.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/7.jpg"
        },
        {
          "price": "$22.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/6.jpg"
        },
        {
          "price": "$23.08",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/4.jpg"
        },
        {
          "price": "$13.14",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/3.jpg"
        },
        {
          "price": "$43.55",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/2.jpg"
        },
      ]
    };
  }

  getDataForTab9 = (): any => {
    return {
      "items": [
        {
          "price": "$43.01",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/8.jpg"
        },
        {
          "price": "$22.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/9.jpg"
        },
        {
          "price": "$23.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/10.jpg"
        },
        {
          "price": "$13.11",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/11.jpg"
        },
        {
          "price": "$13.16",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/12.jpg"
        },
      ]
    };
  }

  getDataForTab10 = (): any => {
    return {
      "items": [
        {
          "price": "$23.06",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/0.jpg"
        },
        {
          "price": "$31.16",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/2.jpg"
        },
        {
          "price": "$38.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/3.jpg"
        },
        {
          "price": "$40.99",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/4.jpg"
        },
        {
          "price": "$63.66",
          "shareIcon": "more",
          "title": "Lorem ipsum dolor sit 1",
          "subtitle": "Subtitle",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "cardImage": "assets/images/background/5.jpg"
        },
      ]
    };
  }

  /** Settings Tabs Header tab - text  **/

  getDataForTab11 = (): any => {
    return {
      "items": [
        {
          "title": "Ella	Hodges",
          "subtitle": "ella.hodges@email",
          "price": "get",
          "avatar": "assets/images/avatar/0.jpg"
        },
        {
          "title": "Megan	Wallace",
          "subtitle": "megan.wallace@email",
          "price": "get",
          "avatar": "assets/images/avatar/1.jpg"
        },
        {
          "title": "Theresa	Slater",
          "subtitle": "theresa.slater@email",
          "price": "get",
          "avatar": "assets/images/avatar/2.jpg"
        },
        {
          "title": "Kylie	Clarkson",
          "subtitle": "kylie.clarkson@email",
          "price": "get",
          "avatar": "assets/images/avatar/3.jpg"
        },
        {
          "title": "Blake	Baker	",
          "subtitle": "blake.baker@email",
          "price": "get",
          "avatar": "assets/images/avatar/21.jpg"
        },
        {
          "title": "Jack	Arnold	",
          "subtitle": "jack.arnold@email",
          "price": "get",
          "avatar": "assets/images/avatar/20.jpg"
        },
        {
          "title": "Anne	Lambert",
          "subtitle": "anne.lambert@email",
          "price": "get",
          "avatar": "assets/images/avatar/19.jpg"
        }
      ]
    };
  }

  getDataForTab12 = (): any => {
    return {
      "items": [
        {
          "title": "Amy	Lee",
          "subtitle": "amy.lee@email",
          "price": "get",
          "avatar": "assets/images/avatar/18.jpg"
        },
        {
          "title": "Mary	Watson",
          "subtitle": "mary.watson@email",
          "price": "get",
          "avatar": "assets/images/avatar/17.jpg"
        },
        {
          "title": "Yvonne	Hardacre",
          "subtitle": "yvonne.hardacre@email",
          "price": "get",
          "avatar": "assets/images/avatar/16.jpg"
        },
        {
          "title": "Audrey	Ball",
          "subtitle": "audrey.ball@email",
          "price": "get",
          "avatar": "assets/images/avatar/15.jpg"
        },
        {
          "title": "Anne	Russell",
          "subtitle": "anne.russell@emai",
          "price": "get",
          "avatar": "assets/images/avatar/14.jpg"
        },
        {
          "title": "Rachel	Grant",
          "subtitle": "rachel.grant@email",
          "price": "get",
          "avatar": "assets/images/avatar/13.jpg"
        },
        {
          "title": "Katherine	Welch",
          "subtitle": "katherine.welch@email",
          "price": "get",
          "avatar": "assets/images/avatar/12.jpg"
        }
      ]
    };
  }

  getDataForTab13 = (): any => {
    return {
      "items": [
        {
          "title": "Emily	Walsh",
          "subtitle": "emily.walsh@email",
          "price": "get",
          "avatar": "assets/images/avatar/11.jpg"
        },
        {
          "title": "Sonia	Bailey",
          "subtitle": "sonia.bailey@email",
          "price": "get",
          "avatar": "assets/images/avatar/10.jpg"
        },
        {
          "title": "Jennifer	Bell",
          "subtitle": "jennifer.bell@email",
          "price": "get",
          "avatar": "assets/images/avatar/9.jpg"
        },
        {
          "title": "Alison	Hamilton",
          "subtitle": "alison.hamilton@email",
          "price": "get",
          "avatar": "assets/images/avatar/8.jpg"
        },
        {
          "title": "Irene	Oliver",
          "subtitle": "irene.oliver@email",
          "price": "get",
          "avatar": "assets/images/avatar/7.jpg"
        },
        {
          "title": "Alison	Jones",
          "subtitle": "alison.jones@email",
          "price": "get",
          "avatar": "assets/images/avatar/6.jpg"
        },
        {
          "title": "Pippa	Wright",
          "subtitle": "pippa.wright@email",
          "price": "get",
          "avatar": "assets/images/avatar/5.jpg"
        }
      ]
    };
  }

  getDataForTab14 = (): any => {
    return {
      "items": [
        {
          "title": "Maria	Payne",
          "subtitle": "maria.payne@email",
          "price": "get",
          "avatar": "assets/images/avatar/4.jpg"
        },
        {
          "title": "Hannah	Coleman",
          "subtitle": "hannah.coleman@email",
          "price": "get",
          "avatar": "assets/images/avatar/3.jpg"
        },
        {
          "title": "Sally	James",
          "subtitle": "sally.james@emai",
          "price": "get",
          "avatar": "assets/images/avatar/2.jpg"
        },
        {
          "title": "Julia	Walker",
          "subtitle": "julia.walker@email",
          "price": "get",
          "avatar": "assets/images/avatar/1.jpg"
        }
      ]
    };
  }

  getDataForLayout1 = (): Array<any> => {
    return [];
  };

  getDataForLayout2 = (): Array<any> => {
    return [];
  };

  getDataForLayout3 = (): Array<any> => {
    return [];
  };

  getEventsForTheme = (menuItem: any): any => {
    var that = this;
    return {
      'onItemClick': function(item: any) {
          that.toastCtrl.presentToast(item);
      }
    };
  };

  prepareParams = (item: any) => {
    let result = {
      title: item.title,
      data: [],
      events: this.getEventsForTheme(item)
    };
    result[this.getShowItemId(item)] = true;
    return result;
  };

  getShowItemId = (item: any): string => {
    return this.getId() + item.theme.charAt(0).toUpperCase() + "" + item.theme.slice(1);
  };

  load(item: any): Observable<any> {
    var that = this;
    that.loadingService.show();
    if (AppSettings.IS_FIREBASE_ENABLED) {
      console.log("Firebase not enabled");
        // return new Observable(observer => {
        //     this.af
        //       .object('tab/' + item)
        //         .valueChanges()
        //         .subscribe(snapshot => {
        //             that.loadingService.hide();
        //             observer.next(snapshot);
        //             observer.complete();
        //         }, err => {
        //             that.loadingService.hide();
        //             observer.error([]);
        //             observer.complete();
        //         });
        // });
    } else {
        return new Observable(observer => {
            that.loadingService.hide();
            observer.next(this.getDataForTheme(item));
            observer.complete();
        });
    }
}
}
