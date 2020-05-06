import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EntityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
  providedIn: 'root',
})
export class EntityService {

  constructor(public http: HttpClient) {
  }

  async getEntities(filter?: string): Promise<any> {
    let entities: any = await this.http.get('../assets/mocks/entities.json').toPromise();
    if (filter) {
      entities = entities.filter((entity: any) => {
        if (entity.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
            entity.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return entity;
        }
      });
    }
    return entities;
  }

}
