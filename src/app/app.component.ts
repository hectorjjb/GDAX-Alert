import { Component, OnInit } from '@angular/core';
import { GdaxService } from './gdax.service';
import { NotificationService } from './notification.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public buyPrice = 0;
    public buyVolume = 0;
    public sellPrice = 0;
    public sellVolume = 0;
    public totalPrice = 0;
    public totalVolume = 0;
    private wantedPrice = 200;
    private reset = false;

    constructor(private notificationSvc: NotificationService, private gdaxSvc: GdaxService) { }

    public ngOnInit(): void {
        this.gdaxSvc.priceChange$.subscribe(changes => {
            console.log(changes);
            this.buyPrice = changes[0][1];
            this.buyVolume = changes[0][0];
            this.sellPrice = changes[1][1];
            this.sellVolume = changes[1][0];
            this.totalPrice =  changes[2][1];
            this.totalVolume =  changes[2][0];
            if (changes[2][1] > this.wantedPrice) {
                this.notificationSvc.notify('$ ' + changes[2][1]);
            }
        });
    }
}
