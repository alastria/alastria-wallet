import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

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

  getEntities(filter?: string): Observable<any> {
    return this.http.get('../assets/mocks/entities.json');
  }

}
