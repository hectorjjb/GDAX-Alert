import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GdaxService } from './gdax.service';
import { NotificationService } from './notification.service';



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [
        GdaxService,
        NotificationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
