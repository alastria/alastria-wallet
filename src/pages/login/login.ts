import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'login',
    templateUrl: 'login.html'
})
export class Login {
    @Input() data: any;
    @Input() events: any;

    public username: string;
    public password: string;

    private isUsernameValid: boolean = true;
    private isPasswordValid: boolean = true;
  
    constructor() {
        
     }

    onEvent = (event: string): void => {
        if (event == "onLogin" && !this.validate()) {
            return ;
        }
        if (this.events[event]) {
            this.events[event]({
                'username' : this.username,
                'password' : this.password
            });
        }
      }
    
    validate():boolean {
        this.isUsernameValid = true;
        this.isPasswordValid = true;

        if (!this.username ||this.username.length == 0) {
            this.isUsernameValid = false;
        }
    
        if (!this.password || this.password.length == 0) {
            this.isPasswordValid = false;
        }
        
        return this.isPasswordValid && this.isUsernameValid;
     }
}
