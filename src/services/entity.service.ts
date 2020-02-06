import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EntityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EntityService {

  constructor(public http: HttpClient) {
  }

  async getEntities(filter?: string): Promise<any> {
    const entities = await this.http.get('../assets/mocks/entities.json').toPromise();
    console.log('COMPONENT --> ', entities);

    return entities;
  }

}
