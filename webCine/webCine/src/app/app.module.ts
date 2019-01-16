import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ModalsComponent } from './components/modals/modals.component';
import { LoginServicesService } from './services/login-services.service';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ModalsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [LoginServicesService],
    bootstrap: [AppComponent]
})
export class AppModule { }
