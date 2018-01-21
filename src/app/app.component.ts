import { Component, OnInit } from '@angular/core';
import { GdaxService, Tick } from './gdax.service';
import { NotificationService } from './notification.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public tick: Tick;
    private wantedPrice = 205;
    private reset = false;

    constructor(private notificationSvc: NotificationService, private gdaxSvc: GdaxService) { }

    public ngOnInit(): void {
        this.gdaxSvc.priceChange$.subscribe(tick => {
            console.log(tick);
            this.tick = tick;
            if (tick.price > this.wantedPrice) {
                this.notificationSvc.notify('$ ' + tick.price);
            }
        });
    }
}
