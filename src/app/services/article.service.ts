import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the EntityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
  providedIn: 'root',
})
export class ArticleService {

  constructor(public http: HttpClient) {
  }

  getArticles(): Observable<any> {
    return this.http.get('../assets/mocks/articles.json');
  }

}
