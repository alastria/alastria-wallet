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
export class NotificationService {

  constructor(public http: HttpClient) {
  }

  getNotifications(): Observable<any> {
    return this.http.get('../assets/mocks/notifications.json');
  }

}
