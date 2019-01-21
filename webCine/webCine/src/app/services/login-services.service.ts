import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoginServicesService {

    constructor() {

    }

    login(user: string, pass: string) {
        return true;
    }
}
