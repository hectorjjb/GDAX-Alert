import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoinbaseService, Tick } from './coinbase.service';
import { NotificationService } from './notification.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    public tick: Tick;
    private reset = false;

    constructor(private notificationSvc: NotificationService, private coinbaseSvc: CoinbaseService) { }

    public ngOnInit(): void {
        this.coinbaseSvc.priceChange$.subscribe(tick => {
            // console.log(tick);
            this.tick = tick;
            if (tick.high_24h_delta === 0) {
                this.notificationSvc.notify('New High $' + tick.price);
            } else if (tick.low_24h_delta === 0) {
                this.notificationSvc.notify('New Low $' + tick.price);
            }
        });
    }
}
